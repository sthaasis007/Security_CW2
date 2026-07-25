"use client";
import React, { useState } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import styles from "./AdminLayout.module.css";

interface AdminLayoutProps {
  children: React.ReactNode;
  currentPage?: string;
}

export default function AdminLayout({ children, currentPage = "Users" }: AdminLayoutProps) {
  const router = useRouter();
  const [showLogoutConfirm, setShowLogoutConfirm] = useState(false);

  const handleLogout = () => {
    localStorage.removeItem("token");
    router.push("/login");
  };

  return (
    <div className={styles.container}>
      {/* Sidebar */}
      <aside className={styles.sidebar}>
        <div className={styles.sidebarContent}>
          <h2 className={styles.adminTitle}>Admin Panel</h2>
          <nav className={styles.navMenu}>
            <Link href="/admin/users" className={`${styles.navItem} ${currentPage === "Users" ? styles.active : ""}`}>
              Users
            </Link>
            <Link href="/admin/products" className={`${styles.navItem} ${currentPage === "Products" ? styles.active : ""}`}>
              Products
            </Link>
          </nav>
        </div>
        <div className={styles.sidebarFooter}>
          <div className={styles.sidebarLabel}>SIDEBAR</div>
        </div>
      </aside>

      {/* Main Content */}
      <main className={styles.mainContent}>
        {/* Header */}
        <header className={styles.header}>
          <div className={styles.headerContent}>
            <div className={styles.welcomeText}>Welcome Admin</div>
            <button
              className={styles.logoutBtn}
              onClick={() => setShowLogoutConfirm(true)}
            >
              Logout
            </button>
          </div>
        </header>

        {/* Body Content */}
        <section className={styles.body}>
          <div className={styles.bodyBox}>BODY</div>
          {children}
        </section>

        {/* Footer */}
        <footer className={styles.footer}>
          <div className={styles.footerBox}>FOOTER</div>
          <p>2025 © My App</p>
        </footer>
      </main>

      {/* Logout Confirmation Modal */}
      {showLogoutConfirm && (
        <div className={styles.modal}>
          <div className={styles.modalContent}>
            <h3>Confirm Logout</h3>
            <p>Are you sure you want to logout?</p>
            <div className={styles.modalButtons}>
              <button onClick={handleLogout} className={styles.confirmBtn}>Yes, Logout</button>
              <button onClick={() => setShowLogoutConfirm(false)} className={styles.cancelBtn}>Cancel</button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
