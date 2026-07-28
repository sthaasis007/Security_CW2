"use client";
import React, { useEffect, useState } from "react";
import apiFetch, { getSession } from "@/app/lib/request";
import { useRouter } from "next/navigation";
import styles from "./UserProfile.module.css";
import { buildImageUrl } from "@/app/lib/imageUrl";

export default function UserProfile() {
  const router = useRouter();
  const [formData, setFormData] = useState({
    name: "",
    email: "",
  });
  const [image, setImage] = useState<File | null>(null);
  const [imagePreview, setImagePreview] = useState<string | null>(null);
  const [currentImage, setCurrentImage] = useState<string | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [isSaving, setIsSaving] = useState(false);
  const [error, setError] = useState("");
  const [success, setSuccess] = useState("");
  const [editingField, setEditingField] = useState<string | null>(null);
  const [editValue, setEditValue] = useState("");
  const [isHydrated, setIsHydrated] = useState(false);
  const [userId, setUserId] = useState<string | null>(null);
  const [mfaEnabled, setMfaEnabled] = useState(false);
  const [recoveryCodes, setRecoveryCodes] = useState<string[]>([]);

  // Fetch user data on mount
  useEffect(() => {
    setIsHydrated(true);
    
    const buildUserImageUrl = (image?: string | null) => buildImageUrl(image);

    const fetchUserData = async () => {
      try {
        const sessionUser = await getSession();
        if (!sessionUser?.id) throw new Error("Please log in again");
        setUserId(sessionUser.id);
        const res = await apiFetch(`/api/auth/${sessionUser.id}`);
        if (!res.ok) throw new Error("Failed to load profile");
        const data = await res.json();
        const user = data.user || data;
        setFormData({ name: user.name || "", email: user.email || "" });
        setMfaEnabled(Boolean(user.mfaEnabled));
        if (user.image) setCurrentImage(buildUserImageUrl(user.image));
      } catch (err) {
        setError("Failed to load profile data");
        console.error("Error loading profile:", err);
      } finally {
        setIsLoading(false);
      }
    };

    fetchUserData();
  }, []);

  const handleImageChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      setImage(file);
      const reader = new FileReader();
      reader.onloadend = () => {
        setImagePreview(reader.result as string);
      };
      reader.readAsDataURL(file);
    }
  };

  const handleEditClick = (field: string, value: string) => {
    setEditingField(field);
    setEditValue(value);
  };

  const handleSaveField = async (field: string) => {
    if (editValue.trim() === "") {
      alert("Field cannot be empty");
      return;
    }

    setIsSaving(true);
    try {
      if (!userId) {
        throw new Error("User ID not found");
      }

      const fd = new FormData();
      fd.append(field, editValue);

      const response = await apiFetch(`/api/auth/${userId}`, { method: "PUT", body: fd });

      if (!response.ok) {
        throw new Error("Failed to update profile");
      }

      // Update state
      setFormData((prev) => ({
        ...prev,
        [field]: editValue,
      }));

      setSuccess("Profile updated successfully!");
      setEditingField(null);

      setTimeout(() => setSuccess(""), 3000);
    } catch (err) {
      setError(err instanceof Error ? err.message : "An error occurred");
      console.error("Error updating profile:", err);
    } finally {
      setIsSaving(false);
    }
  };

  const handleImageUpload = async () => {
    if (!image && !imagePreview) return;

    setIsSaving(true);
    try {
      if (!userId) {
        throw new Error("User ID not found");
      }

      const fd = new FormData();
      if (image) fd.append("image", image);

      const response = await apiFetch(`/api/auth/${userId}`, { method: "PUT", body: fd });

      if (!response.ok) {
        throw new Error("Failed to update profile image");
      }

      const responseData = await response.json();
      
      const filename = responseData.user?.image || responseData.image;
      setCurrentImage(buildImageUrl(filename));

      setSuccess("Profile image updated successfully!");
      setImage(null);
      setImagePreview(null);

      setTimeout(() => {
        setSuccess("");
        window.location.reload();
      }, 800);
    } catch (err) {
      setError(err instanceof Error ? err.message : "An error occurred");
      console.error("Error updating image:", err);
    } finally {
      setIsSaving(false);
    }
  };

  const handleDeleteAccount = async () => {
    if (!confirm("Are you sure you want to delete your account? This cannot be undone.")) return;

    setIsSaving(true);
    try {
      if (!userId) {
        throw new Error("User ID not found");
      }

      const res = await apiFetch("/api/privacy/account", { method: "DELETE" });

      if (!res.ok) {
        throw new Error("Failed to delete account");
      }

      localStorage.removeItem("token");
      localStorage.removeItem("refreshToken");
      localStorage.removeItem("user");
      router.push("/login");
    } catch (err) {
      setError(err instanceof Error ? err.message : "An error occurred");
    } finally {
      setIsSaving(false);
    }
  };

  const handleExport = async (format: "json" | "csv") => {
    setIsSaving(true);
    setError("");
    try {
      const response = await apiFetch(`/api/privacy/export?format=${format}`);
      if (!response.ok) throw new Error("Unable to export personal data");
      const blob = await response.blob();
      const url = URL.createObjectURL(blob);
      const link = document.createElement("a");
      link.href = url;
      link.download = `personal-data.${format}`;
      link.click();
      URL.revokeObjectURL(url);
    } catch (err) {
      setError(err instanceof Error ? err.message : "Unable to export personal data");
    } finally {
      setIsSaving(false);
    }
  };

  const handleImport = async (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    event.target.value = "";
    if (!file) return;
    setIsSaving(true);
    setError("");
    try {
      const data = new FormData();
      data.append("file", file);
      const response = await apiFetch("/api/privacy/import", { method: "POST", body: data });
      const body = await response.json().catch(() => ({}));
      if (!response.ok) throw new Error(body.message || "Unable to import profile");
      setFormData((current) => ({ ...current, name: body.user.name }));
      setSuccess("Profile name imported successfully.");
    } catch (err) {
      setError(err instanceof Error ? err.message : "Unable to import profile");
    } finally {
      setIsSaving(false);
    }
  };

  const handleLogoutAll = async () => {
    setIsSaving(true);
    try {
      const response = await apiFetch("/api/auth/logout-all", { method: "POST" });
      if (!response.ok) throw new Error("Failed to invalidate sessions");
      localStorage.removeItem("token");
      localStorage.removeItem("refreshToken");
      localStorage.removeItem("user");
      router.push("/login");
    } catch (err) {
      setError(err instanceof Error ? err.message : "An error occurred");
    } finally {
      setIsSaving(false);
    }
  };

  const handleEnableMfa = async () => {
    setIsSaving(true);
    setError("");
    try {
      const beginResponse = await apiFetch("/api/auth/mfa/setup", { method: "POST" });
      const begin = await beginResponse.json().catch(() => ({}));
      if (!beginResponse.ok) throw new Error(begin.message || "Unable to start MFA setup");
      const code = window.prompt("Enter the six-digit security code sent to your email");
      if (!code) return;
      const verifyResponse = await apiFetch("/api/auth/mfa/setup/verify", {
        method: "POST",
        body: JSON.stringify({ challengeToken: begin.challengeToken, code }),
      });
      const verified = await verifyResponse.json().catch(() => ({}));
      if (!verifyResponse.ok) throw new Error(verified.message || "Invalid security code");
      setMfaEnabled(true);
      setRecoveryCodes(verified.recoveryCodes || []);
      setSuccess("Multi-factor authentication is enabled. Save the recovery codes now.");
    } catch (err) {
      setError(err instanceof Error ? err.message : "Unable to enable MFA");
    } finally {
      setIsSaving(false);
    }
  };

  const handleDisableMfa = async () => {
    const password = window.prompt("Enter your password to disable MFA");
    if (!password) return;
    setIsSaving(true);
    try {
      const response = await apiFetch("/api/auth/mfa/disable", {
        method: "POST",
        body: JSON.stringify({ password }),
      });
      const body = await response.json().catch(() => ({}));
      if (!response.ok) throw new Error(body.message || "Unable to disable MFA");
      router.push("/login");
    } catch (err) {
      setError(err instanceof Error ? err.message : "Unable to disable MFA");
    } finally {
      setIsSaving(false);
    }
  };

  if (!isHydrated) {
    return (
      <div className={styles.loadingContainer}>
        <p>Initializing...</p>
      </div>
    );
  }

  if (isLoading) {
    return (
      <div className={styles.loadingContainer}>
        <p>Loading profile...</p>
      </div>
    );
  }

  return (
    <div className={styles.container}>
      <div className={styles.profileCard}>
        <div className={styles.profileHeader}>
          <h2 className={styles.title}>My Profile</h2>
        </div>

        {error && <div className={styles.errorMessage}>{error}</div>}
        {success && <div className={styles.successMessage}>{success}</div>}

        {/* Image Section */}
        <div className={styles.imageSection}>
          <div className={styles.profileImageContainer}>
            {imagePreview ? (
              <img src={imagePreview} alt="New Profile" className={styles.profileImage} />
            ) : currentImage ? (
              <img src={currentImage} alt="Profile" className={styles.profileImage} />
            ) : (
              <div className={styles.imagePlaceholder}>
                <svg width="80" height="80" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                  <path d="M20 21v-2a4 4 0 0 0-4-4H8a4 4 0 0 0-4 4v2"></path>
                  <circle cx="12" cy="7" r="4"></circle>
                </svg>
              </div>
            )}
            <label htmlFor="profileImage" className={styles.imageUploadLabel}>
              <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                <path d="M12 5v14M5 12h14"></path>
              </svg>
            </label>
            <input
              type="file"
              id="profileImage"
              onChange={handleImageChange}
              className={styles.fileInput}
              accept="image/*"
            />
          </div>

          {imagePreview && (
            <div className={styles.imageButtonGroup}>
              <button
                type="button"
                className={styles.saveImageBtn}
                onClick={handleImageUpload}
                disabled={isSaving}
              >
                {isSaving ? "Uploading..." : "Upload Image"}
              </button>
              <button
                type="button"
                className={styles.cancelImageBtn}
                onClick={() => {
                  setImage(null);
                  setImagePreview(null);
                }}
                disabled={isSaving}
              >
                Cancel
              </button>
            </div>
          )}
        </div>

        {/* Profile Info Section */}
        <div className={styles.profileInfoSection}>
          {editingField === null ? (
            <>
              <div className={styles.infoItem}>
                <div className={styles.infoContent}>
                  <span className={styles.infoLabel}>Full Name</span>
                  <span className={styles.infoValue}>{formData.name || "-"}</span>
                </div>
                <button
                  className={styles.editIconBtn}
                  onClick={() => handleEditClick("name", formData.name)}
                  title="Edit name"
                >
                  <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                    <path d="M11 4H4a2 2 0 0 0-2 2v14a2 2 0 0 0 2 2h14a2 2 0 0 0 2-2v-7"></path>
                    <path d="M18.5 2.5a2.121 2.121 0 0 1 3 3L12 15l-4 1 1-4 9.5-9.5z"></path>
                  </svg>
                </button>
              </div>

              <div className={styles.infoItem}>
                <div className={styles.infoContent}>
                  <span className={styles.infoLabel}>Email</span>
                  <span className={styles.infoValue}>{formData.email || "-"}</span>
                </div>
                <button
                  className={styles.editIconBtn}
                  onClick={() => handleEditClick("email", formData.email)}
                  title="Edit email"
                >
                  <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                    <path d="M11 4H4a2 2 0 0 0-2 2v14a2 2 0 0 0 2 2h14a2 2 0 0 0 2-2v-7"></path>
                    <path d="M18.5 2.5a2.121 2.121 0 0 1 3 3L12 15l-4 1 1-4 9.5-9.5z"></path>
                  </svg>
                </button>
              </div>
            </>
          ) : (
            <div className={styles.editForm}>
              <div className={styles.editFormGroup}>
                <label className={styles.editLabel}>{editingField === "name" ? "Full Name" : "Email"}</label>
                <input
                  type={editingField === "email" ? "email" : "text"}
                  value={editValue}
                  onChange={(e) => setEditValue(e.target.value)}
                  className={styles.editInput}
                  placeholder={editingField === "name" ? "Enter your name" : "Enter your email"}
                />
              </div>
              <div className={styles.editButtonGroup}>
                <button
                  className={styles.saveBtn}
                  onClick={() => handleSaveField(editingField)}
                  disabled={isSaving}
                >
                  {isSaving ? "Saving..." : "Save"}
                </button>
                <button
                  className={styles.cancelBtn}
                  onClick={() => setEditingField(null)}
                  disabled={isSaving}
                >
                  Cancel
                </button>
              </div>
            </div>
          )}
        </div>

        {/* Delete Account */}
        <div className={styles.deleteSection}>
          <button className={styles.deleteBtn} onClick={() => handleExport("json")} disabled={isSaving}>
            Export My Data (JSON)
          </button>
          <button className={styles.deleteBtn} onClick={() => handleExport("csv")} disabled={isSaving}>
            Export My Data (CSV)
          </button>
          <label className={styles.deleteBtn}>
            Import Profile JSON
            <input type="file" accept="application/json,.json" onChange={handleImport} disabled={isSaving} hidden />
          </label>
          <button className={styles.deleteBtn} onClick={mfaEnabled ? handleDisableMfa : handleEnableMfa} disabled={isSaving}>
            {mfaEnabled ? "Disable Email MFA" : "Enable Email MFA"}
          </button>
          {recoveryCodes.length > 0 && (
            <div>
              <strong>Recovery codes (shown once):</strong>
              <pre>{recoveryCodes.join("\n")}</pre>
            </div>
          )}
          <button className={styles.deleteBtn} onClick={handleLogoutAll} disabled={isSaving}>
            Log Out All Devices
          </button>
          <button className={styles.deleteBtn} onClick={handleDeleteAccount} disabled={isSaving}>
            Delete Account
          </button>
        </div>
      </div>
    </div>
  );
}

