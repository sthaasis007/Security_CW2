"use client";
import { useEffect, useState } from "react";
import styles from "./ActivityLog.module.css";

interface ActivityItem {
  _id: string;
  action: string;
  description?: string;
  userEmail?: string;
  username?: string;
  role?: string;
  createdAt: string;
}

export default function ActivityLog() {
  const [activities, setActivities] = useState<ActivityItem[]>([]);
  const [search, setSearch] = useState("");
  const [action, setAction] = useState("");
  const [user, setUser] = useState("");
  const [from, setFrom] = useState("");
  const [to, setTo] = useState("");
  const [loading, setLoading] = useState(true);

  const fetchActivities = async () => {
    const token = localStorage.getItem("token");
    if (!token) return;

    setLoading(true);
    const query = new URLSearchParams();
    if (search) query.set("search", search);
    if (action) query.set("action", action);
    if (user) query.set("user", user);
    if (from) query.set("from", from);
    if (to) query.set("to", to);

    const res = await fetch(`/api/activity?${query.toString()}`, {
      headers: { Authorization: `Bearer ${token}` },
    });

    if (res.ok) {
      const data = await res.json();
      setActivities(data.activities || []);
    }
    setLoading(false);
  };

  useEffect(() => {
    void fetchActivities();
  }, []);

  return (
    <div className={styles.container}>
      <div className={styles.filters}>
        <input
          className={styles.input}
          placeholder="Search username / action"
          value={search}
          onChange={(e) => setSearch(e.target.value)}
        />
        <input
          className={styles.input}
          placeholder="Filter by action"
          value={action}
          onChange={(e) => setAction(e.target.value)}
        />
        <input
          className={styles.input}
          placeholder="Filter by user"
          value={user}
          onChange={(e) => setUser(e.target.value)}
        />
        <input className={styles.input} type="date" value={from} onChange={(e) => setFrom(e.target.value)} />
        <input className={styles.input} type="date" value={to} onChange={(e) => setTo(e.target.value)} />
        <button className={styles.input} onClick={() => void fetchActivities()}>
          Apply
        </button>
      </div>

      {loading ? (
        <p>Loading activity log…</p>
      ) : (
        <table className={styles.table}>
          <thead>
            <tr>
              <th className={styles.th}>Timestamp</th>
              <th className={styles.th}>User</th>
              <th className={styles.th}>Role</th>
              <th className={styles.th}>Action</th>
              <th className={styles.th}>Description</th>
            </tr>
          </thead>
          <tbody>
            {activities.map((activity) => (
              <tr key={activity._id}>
                <td className={styles.td}>{new Date(activity.createdAt).toLocaleString()}</td>
                <td className={styles.td}>{activity.username || activity.userEmail || "—"}</td>
                <td className={styles.td}>{activity.role || "—"}</td>
                <td className={styles.td}><span className={styles.badge}>{activity.action}</span></td>
                <td className={styles.td}>{activity.description || "—"}</td>
              </tr>
            ))}
          </tbody>
        </table>
      )}
    </div>
  );
}
