"use client";
import React, { useEffect, useMemo, useState } from "react";
import styles from "./ProductManagement.module.css";

export type ProductPlacement = "bestseller" | "current";

interface Product {
  _id: string;
  name: string;
  price: number;
  image?: string;
  description?: string;
  placements: ProductPlacement[];
  displayOrder: number;
  createdAt: string;
  available: boolean;
}

const defaultProduct = {
  name: "",
  price: 0,
  description: "",
  placements: ["current"] as ProductPlacement[],
  displayOrder: 1,
  available: true,
};

export default function ProductManagement() {
  const [products, setProducts] = useState<Product[]>([]);
  const [formData, setFormData] = useState(defaultProduct);
  const [editingId, setEditingId] = useState<string | null>(null);
  const [imageFile, setImageFile] = useState<File | null>(null);
  const [imagePreview, setImagePreview] = useState<string | null>(null);
  const [error, setError] = useState("");
  const [isSaving, setIsSaving] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [currentPage, setCurrentPage] = useState(1);

  const ITEMS_PER_PAGE = 10;

  useEffect(() => {
    const fetchProducts = async () => {
      const token = localStorage.getItem("token");
      if (!token) return;

      setIsLoading(true);
      try {
        const res = await fetch("/api/admin/products", {
          headers: { Authorization: `Bearer ${token}` },
        });
        const data = await res.json();
        if (data.products) {
          setProducts(data.products);
        }
      } catch (err) {
        console.error("Failed to fetch products", err);
      } finally {
        setIsLoading(false);
      }
    };

    fetchProducts();
  }, []);

  useEffect(() => {
    if (!imageFile) {
      setImagePreview(null);
      return;
    }

    const url = URL.createObjectURL(imageFile);
    setImagePreview(url);
    return () => URL.revokeObjectURL(url);
  }, [imageFile]);

  const sortedProducts = useMemo(() => {
    return [...products].sort((a, b) => {
      const aHasCurrent = (a.placements || []).includes("current");
      const bHasCurrent = (b.placements || []).includes("current");
      if (aHasCurrent !== bHasCurrent) {
        return aHasCurrent ? -1 : 1;
      }
      return a.displayOrder - b.displayOrder;
    });
  }, [products]);

  const totalPages = Math.max(1, Math.ceil(sortedProducts.length / ITEMS_PER_PAGE));

  useEffect(() => {
    setCurrentPage((prevPage) => Math.min(prevPage, totalPages));
  }, [totalPages]);

  const pagedProducts = useMemo(() => {
    const startIndex = (currentPage - 1) * ITEMS_PER_PAGE;
    return sortedProducts.slice(startIndex, startIndex + ITEMS_PER_PAGE);
  }, [sortedProducts, currentPage]);

  const handleChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>
  ) => {
    const { name, value } = e.target;
    setFormData((prev) => ({
      ...prev,
      [name]: name === "price" || name === "displayOrder" ? Number(value) : value,
    }));
  };

  const handleAvailableChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setFormData((prev) => ({
      ...prev,
      available: e.target.checked,
    }));
  };

  const handlePlacementToggle = (placement: ProductPlacement) => {
    setFormData((prev) => {
      const exists = prev.placements.includes(placement);
      const updated = exists
        ? prev.placements.filter((item) => item !== placement)
        : [...prev.placements, placement];
      return {
        ...prev,
        placements: updated.length ? updated : ["current"],
      };
    });
  };

  const handleImageChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0] || null;
    setImageFile(file);
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError("");

    if (!formData.name.trim()) {
      setError("Product name is required.");
      return;
    }

    if (formData.price <= 0) {
      setError("Price must be greater than 0.");
      return;
    }

    const token = localStorage.getItem("token");
    if (!token) {
      setError("No token found.");
      return;
    }

    setIsSaving(true);
    try {
      const fd = new FormData();
      fd.append("name", formData.name);
      fd.append("price", String(formData.price));
      fd.append("description", formData.description);
      fd.append("placements", formData.placements.join(","));
      fd.append("displayOrder", String(formData.displayOrder));
      fd.append("available", String(formData.available));
      if (imageFile) fd.append("image", imageFile);

      const url = editingId ? `/api/admin/products/${editingId}` : "/api/admin/products";
      const method = editingId ? "PUT" : "POST";
      const res = await fetch(url, {
        method,
        headers: { Authorization: `Bearer ${token}` },
        body: fd,
      });

      const data = await res.json();
      if (!res.ok) {
        throw new Error(data.message || "Failed to create product");
      }

      if (data.product) {
        if (editingId) {
          setProducts((prev) => prev.map((item) => (item._id === data.product._id ? data.product : item)));
        } else {
          setProducts((prev) => [data.product, ...prev]);
        }
      }

      setFormData(defaultProduct);
      setImageFile(null);
      setEditingId(null);
    } catch (err) {
      setError(err instanceof Error ? err.message : "An error occurred");
    } finally {
      setIsSaving(false);
    }
  };

  const handleDelete = async (id: string) => {
    if (!confirm("Delete this product?")) return;
    const token = localStorage.getItem("token");
    if (!token) {
      setError("No token found.");
      return;
    }

    try {
      const res = await fetch(`/api/admin/products/${id}`, {
        method: "DELETE",
        headers: { Authorization: `Bearer ${token}` },
      });
      if (!res.ok) {
        throw new Error("Failed to delete product");
      }
      setProducts((prev) => prev.filter((product) => product._id !== id));
    } catch (err) {
      setError(err instanceof Error ? err.message : "An error occurred");
    }
  };

  const handleEdit = (product: Product) => {
    setEditingId(product._id);
    setFormData({
      name: product.name,
      price: product.price,
      description: product.description || "",
      placements: product.placements && product.placements.length ? product.placements : ["current"],
      displayOrder: product.displayOrder,
      available: product.available,
    });
    setImageFile(null);
  };

  return (
    <div className={styles.container}>
      <div className={styles.headerRow}>
        <h2 className={styles.title}>Product Management</h2>
        <p className={styles.subtitle}>
          Add products for the dashboard. Choose placement: Best Seller (shown in carousel) or Current (grid layout).
        </p>
      </div>

      <form onSubmit={handleSubmit} className={styles.form}>
        {error && <div className={styles.errorMessage}>{error}</div>}

        <div className={styles.grid}>
          <div className={styles.formGroup}>
            <label htmlFor="name" className={styles.label}>
              Product Name *
            </label>
            <input
              id="name"
              name="name"
              type="text"
              value={formData.name}
              onChange={handleChange}
              className={styles.input}
              placeholder="Enter product name"
              required
            />
          </div>

          <div className={styles.formGroup}>
            <label htmlFor="price" className={styles.label}>
              Price *
            </label>
            <input
              id="price"
              name="price"
              type="number"
              min={0}
              step={0.01}
              value={formData.price}
              onChange={handleChange}
              className={styles.input}
              placeholder="0.00"
              required
            />
          </div>

          <div className={styles.formGroup}>
            <label className={styles.label}>Placement *</label>
            <div className={styles.checkboxGroup}>
              <label className={styles.checkboxRow}>
                <input
                  type="checkbox"
                  checked={formData.placements.includes("current")}
                  onChange={() => handlePlacementToggle("current")}
                />
                <span>Current (grid layout)</span>
              </label>
              <label className={styles.checkboxRow}>
                <input
                  type="checkbox"
                  checked={formData.placements.includes("bestseller")}
                  onChange={() => handlePlacementToggle("bestseller")}
                />
                <span>Best Seller (shown in carousel)</span>
              </label>
            </div>
          </div>

          <div className={styles.formGroup}>
            <label className={styles.label}>Availability</label>
            <label className={styles.checkboxRow}>
              <input
                type="checkbox"
                checked={formData.available}
                onChange={handleAvailableChange}
              />
              <span>Available</span>
            </label>
          </div>

          <div className={styles.formGroupFull}>
            <label htmlFor="image" className={styles.label}>
              Product Image
            </label>
            <div className={styles.fileInputWrapper}>
              <input
                id="image"
                name="image"
                type="file"
                accept="image/*"
                onChange={handleImageChange}
                className={styles.fileInput}
              />
              <label htmlFor="image" className={styles.fileInputLabel}>
                Choose Image
              </label>
            </div>
            {imagePreview && (
              <div className={styles.imagePreview}>
                <img src={imagePreview} alt="Preview" />
              </div>
            )}
          </div>

          <div className={styles.formGroupFull}>
            <label htmlFor="description" className={styles.label}>
              Description
            </label>
            <textarea
              id="description"
              name="description"
              value={formData.description}
              onChange={handleChange}
              className={styles.textarea}
              placeholder="Short product description"
              rows={3}
            />
          </div>
        </div>

        <div className={styles.buttonRow}>
          <button type="submit" className={styles.submitBtn} disabled={isSaving}>
            {isSaving ? "Saving..." : editingId ? "Update Product" : "Add Product"}
          </button>
          <button
            type="button"
            className={styles.resetBtn}
            onClick={() => {
              setFormData(defaultProduct);
              setImageFile(null);
              setEditingId(null);
            }}
            disabled={isSaving}
          >
            Cancel
          </button>
        </div>
      </form>

      <div className={styles.tableContainer}>
        <table className={styles.table}>
          <thead>
            <tr>
              <th>Product</th>
              <th>Price</th>
              <th>Placement</th>
              <th>Status</th>
              <th>Actions</th>
            </tr>
          </thead>
          <tbody>
            {sortedProducts.length > 0 ? (
              pagedProducts.map((product) => (
                <tr key={product._id}>
                  <td>
                    <div className={styles.productCell}>
                      {product.image ? (
                        <img
                          src={`http://localhost:5000/uploads/${product.image}`}
                          alt={product.name}
                          className={styles.thumb}
                        />
                      ) : (
                        <div className={styles.thumbPlaceholder}>IMG</div>
                      )}
                      <div>
                        <div className={styles.productName}>{product.name}</div>
                        {product.description && (
                          <div className={styles.productDesc}>{product.description}</div>
                        )}
                      </div>
                    </div>
                  </td>
                  <td>${product.price.toFixed(2)}</td>
                  <td>
                    <div className={styles.badgeGroup}>
                      {(product.placements || []).includes("current") && (
                        <span className={`${styles.badge} ${styles.badgeCurrent}`}>Current</span>
                      )}
                      {(product.placements || []).includes("bestseller") && (
                        <span className={`${styles.badge} ${styles.badgeBest}`}>Best Seller</span>
                      )}
                    </div>
                  </td>
                  <td>
                    <span className={`${styles.badge} ${product.available ? styles.badgeAvailable : styles.badgeUnavailable}`}>
                      {product.available ? "Available" : "Unavailable"}
                    </span>
                  </td>
                  <td>
                    <button
                      type="button"
                      onClick={() => handleEdit(product)}
                      className={styles.editBtn}
                    >
                      Edit
                    </button>
                    <button
                      type="button"
                      onClick={() => handleDelete(product._id)}
                      className={styles.deleteBtn}
                    >
                      Delete
                    </button>
                  </td>
                </tr>
              ))
            ) : (
              <tr>
                <td colSpan={5} className={styles.noData}>
                  {isLoading ? "Loading products..." : "No products added yet."}
                </td>
              </tr>
            )}
          </tbody>
        </table>
      </div>

      <div className={styles.paginationRow}>
        <div className={styles.paginationInfo}>
          Showing {pagedProducts.length} of {sortedProducts.length} products
        </div>
        <div className={styles.paginationControls}>
          <button
            type="button"
            className={styles.pageButton}
            onClick={() => setCurrentPage((page) => Math.max(1, page - 1))}
            disabled={currentPage === 1}
          >
            Prev
          </button>
          <span className={styles.pageText}>
            Page {currentPage} of {totalPages}
          </span>
          <button
            type="button"
            className={styles.pageButton}
            onClick={() => setCurrentPage((page) => Math.min(totalPages, page + 1))}
            disabled={currentPage === totalPages}
          >
            Next
          </button>
        </div>
      </div>
    </div>
  );
}
