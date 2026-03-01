import React, { useEffect, useState, useContext } from "react";
import { subscribeToNotifications } from "../../subscribeToNotifications";
import { UserContext } from "../../UserContext";
import io from "socket.io-client";
import { API_BASE, SOCKET_URL } from "../../config";
import "./Notifications.css";

function Notifications({ onNotificationsRead }) {
  const [notifications, setNotifications] = useState([]);
  const { user, updateUser } = useContext(UserContext);

  useEffect(() => {
    const socket = io(SOCKET_URL, {
      withCredentials: true,
    });
    subscribeToNotifications(user.id, (notification) => {
      setNotifications((prev) => [...prev, notification]);
    });

    fetchNotifications(user.id);

    onNotificationsRead();

    return () => {
      socket.disconnect();
    };
  }, [user.id]);

  async function fetchNotifications(userId) {
    try {
      const response = await fetch(
        `${API_BASE}/notifications/${userId}`
      );
      if (!response.ok) {
        throw new Error("Failed to fetch notifications");
      }
      const data = await response.json();
      setNotifications(data);
    } catch (error) {
      console.error("Error fetching notifications", error);
    }
  }

  async function deleteNotification(id) {
    try {
      const response = await fetch(
        `${API_BASE}/notifications/${id}`,
        {
          method: "DELETE",
        }
      );
      if (!response.ok) {
        throw new Error("Failed to delete notification");
      }
      setNotifications(
        notifications.filter((notification) => notification._id !== id)
      );
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
      <div className="notifications-list">
        {sortedNotifications.map((notification, index) => (
          <div key={index} className="notification-item">
            <p>{notification.content}</p>

            <p>
              {new Date(notification.createdAt).toLocaleDateString()} at{" "}
              {new Date(notification.createdAt).toLocaleTimeString()}
            </p>
          </div>
        ))}
      </div>
    </div>
  );
}

export default Notifications;
