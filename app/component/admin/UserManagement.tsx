"use client";
import React, { useState } from "react";
import Link from "next/link";
import styles from "./UserManagement.module.css";

interface User {
  _id: string;
  name?: string;
  username?: string;
  firstName?: string;
  lastName?: string;
  email: string;
  role: string;
}

interface UserManagementProps {
  users: User[];
  onRefresh: () => void;
  onDelete?: (userId: string) => void;
  isLoading?: boolean;
}

export default function UserManagement({
  users,
  onRefresh,
  onDelete,
  isLoading = false,
}: UserManagementProps) {
  const [searchTerm, setSearchTerm] = useState("");
  const [itemsPerPage, setItemsPerPage] = useState(10);
  const [currentPage, setCurrentPage] = useState(1);

  const getFullName = (user: User) => {
    // Try to use name field first (from backend)
    if (user.name) {
      return user.name;
    }
    // Then try firstName/lastName
    if (user.firstName || user.lastName) {
      return `${user.firstName || ""} ${user.lastName || ""}`.trim();
    }
    // Finally fallback to username
    return user.username || "-";
  };

  const filteredUsers = users.filter((user) =>
    `${getFullName(user)} ${user.email || ""}`
      .toLowerCase()
      .includes(searchTerm.toLowerCase())
  );

  const totalPages = Math.ceil(filteredUsers.length / itemsPerPage);
  const startIndex = (currentPage - 1) * itemsPerPage;
  const paginatedUsers = filteredUsers.slice(
    startIndex,
    startIndex + itemsPerPage
  );

  const handleDeleteClick = (userId: string) => {
    if (confirm("Are you sure you want to delete this user?")) {
      onDelete?.(userId);
    }
  };

  return (
    <div className={styles.container}>
      <h2 className={styles.title}>UserManagement</h2>

      <div className={styles.controlsSection}>
        <div className={styles.controls}>
          <div className={styles.controlGroup}>
            <label className={styles.label}>Show</label>
            <select
              value={itemsPerPage}
              onChange={(e) => {
                setItemsPerPage(Number(e.target.value));
                setCurrentPage(1);
              }}
              className={styles.select}
            >
              <option value={10}>10</option>
              <option value={25}>25</option>
              <option value={50}>50</option>
              <option value={100}>100</option>
            </select>
          </div>

          <div className={styles.controlGroup}>
            <input
              type="text"
              placeholder="Search"
              value={searchTerm}
              onChange={(e) => {
                setSearchTerm(e.target.value);
                setCurrentPage(1);
              }}
              className={styles.searchInput}
            />
          </div>

          <Link href="/admin/users/create" className={styles.createBtn}>
            Create New User
          </Link>
        </div>
      </div>

      <div className={styles.tableContainer}>
        <table className={styles.table}>
          <thead>
            <tr>
              <th>Name</th>
              <th>Email</th>
              <th>Actions</th>
            </tr>
          </thead>
          <tbody>
            {paginatedUsers.length > 0 ? (
              paginatedUsers.map((user) => (
                <tr key={user._id}>
                  <td>{getFullName(user)}</td>
                  <td>{user.email}</td>
                  <td className={styles.actions}>
                    <Link
                      href={`/admin/users/${user._id}/edit`}
                      className={styles.editBtn}
                    >
                      Edit
                    </Link>
                    <button
                      onClick={() => handleDeleteClick(user._id)}
                      className={styles.deleteBtn}
                      disabled={isLoading}
                    >
                      Delete
                    </button>
                  </td>
                </tr>
              ))
            ) : (
              <tr>
                <td colSpan={3} className={styles.noData}>
                  No users found
                </td>
              </tr>
            )}
          </tbody>
        </table>
      </div>

      <div className={styles.paginationSection}>
        <button
          onClick={() => setCurrentPage((p) => Math.max(1, p - 1))}
          disabled={currentPage === 1}
          className={styles.paginationBtn}
        >
          Prev
        </button>
        <span className={styles.pageInfo}>
          Page {currentPage} of {totalPages || 1}
        </span>
        <button
          onClick={() => setCurrentPage((p) => Math.min(totalPages, p + 1))}
          disabled={currentPage === totalPages || totalPages === 0}
          className={styles.paginationBtn}
        >
          Next
        </button>
      </div>
    </div>
  );
}
