import React, { useEffect, useState, useContext } from "react";
import { subscribeToNotifications } from "../../subscribeToNotifications";
import { UserContext } from "../../UserContext";
import "./Notifications.css";

function Notifications({ onNotificationsRead }) {
  const [notifications, setNotifications] = useState([]);
  const [fetchError, setFetchError] = useState(null);
  const { user } = useContext(UserContext);

  useEffect(() => {
    if (!user?.id) {
      return undefined;
    }

    const unsubscribe = subscribeToNotifications(user.id, (notification) => {
      setNotifications((prev) => [notification, ...prev]);
    });

    fetchNotifications();
    onNotificationsRead();

    return () => {
      unsubscribe();
    };
    // Intentionally omit onNotificationsRead: parent passes a new function each render.
  }, [user?.id]);

  async function fetchNotifications() {
    setFetchError(null);
    try {
      const response = await fetch(`http://localhost:3000/notifications`, {
        credentials: "include",
      });
      if (response.status === 401) {
        setFetchError("Sign in again to load notifications.");
        setNotifications([]);
        return;
      }
      if (!response.ok) {
        throw new Error("Failed to fetch notifications");
      }
      const data = await response.json();
      setNotifications(Array.isArray(data) ? data : []);
    } catch (error) {
      console.error("Error fetching notifications", error);
      setFetchError("Could not load notifications. Is the backend running?");
    }
  }

  async function deleteNotification(id) {
    try {
      const response = await fetch(
        `http://localhost:3000/notifications/${id}`,
        {
          method: "DELETE",
          credentials: "include",
        }
      );
      if (!response.ok) {
        throw new Error("Failed to delete notification");
      }
      setNotifications((prev) => prev.filter((n) => n.id !== id));
    } catch (error) {
      console.error("Error deleting notification", error);
    }
  }

  const sortedNotifications = [...notifications].sort(
    (a, b) => new Date(b.createdAt) - new Date(a.createdAt)
  );

  return (
    <div className="notifications-container">
      <h3>Notifications</h3>
      {fetchError ? (
        <p className="notifications-error" role="alert">
          {fetchError}
        </p>
      ) : null}
      <div className="notifications-list">
        {!fetchError && sortedNotifications.length === 0 ? (
          <p className="notifications-empty">
            No notifications yet. Edits, comments, and task changes on shared
            projects appear here (including your own when you&apos;re the only
            member).
          </p>
        ) : null}
        {sortedNotifications.length > 0 ? (
          sortedNotifications.map((notification) => (
            <div key={notification.id} className="notification-item">
              <p>{notification.content}</p>
              <p className="notification-meta">
                {new Date(notification.createdAt).toLocaleDateString()} at{" "}
                {new Date(notification.createdAt).toLocaleTimeString()}
              </p>
              <button
                type="button"
                className="notification-dismiss"
                onClick={() => deleteNotification(notification.id)}
              >
                Dismiss
              </button>
            </div>
          ))
        ) : null}
      </div>
    </div>
  );
}

export default Notifications;
