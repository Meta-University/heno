import React, { useEffect, useState, useContext } from "react";
import { subscribeToNotifications } from "../../subscribeToNotifications";
import { UserContext } from "../../UserContext";
import io from "socket.io-client";
import "./Notifications.css";

function Notifications() {
  const [notifications, setNotifications] = useState([]);
  const { user, updateUser } = useContext(UserContext);

  useEffect(() => {
    const socket = io("http://localhost:3000", {
      withCredentials: true,
    });
    subscribeToNotifications(user.id, (notification) => {
      setNotifications((prev) => [...prev, notification]);
    });

    fetchNotifications(user.id);

    return () => {
      socket.disconnect();
    };
  }, [user.id]);

  async function fetchNotifications(userId) {
    try {
      const response = await fetch(
        `http://localhost:3000/notifications/${userId}`
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

  return (
    <div className="notifications-container">
      <h3>Notifications</h3>
      <div className="notifications-list">
        {notifications.map((notification, index) => (
          <div key={index} className="notifcation-item">
            <p>{notification.content}</p>
            <p>At {new Date(notification.createdAt).toLocaleDateString()}</p>
          </div>
        ))}
      </div>
    </div>
  );
}

export default Notifications;
