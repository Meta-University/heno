import io from "socket.io-client";

const socket = io(`${import.meta.env.VITE_BACKEND_URL}`, {
  withCredentials: true,
});

function subscribeToNotifications(userId, callback) {
  socket.on(`notifications-${userId}`, (notification) => {
    callback(notification);
  });
}

export { subscribeToNotifications };
