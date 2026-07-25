"use client";
import React from "react";
import useAuth from "../lib/useAuth";
import UserProfile from "../component/profile/UserProfile";
import TopBar from "../component/dashboard/TopBar";
import Footer from "../component/dashboard/Footer";

export default function ProfilePage() {
  const { ready } = useAuth({ requireLogin: true });

  if (!ready) {
    return (
      <div style={{ display: "flex", justifyContent: "center", alignItems: "center", minHeight: "100vh" }}>
        Loading...
      </div>
    );
  }

  return (
    <>
      <TopBar />
      <UserProfile />
      <Footer />
    </>
  );
}