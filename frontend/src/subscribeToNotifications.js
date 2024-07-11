import io from "socket.io-client";

const socket = io("http://localhost:3000", {
  withCredentials: true,
});

function subscribeToNotifications(userId, callback) {
  socket.on(`notifications-${userId}`, (notification) => {
    callback(notification);
  });
}

export { subscribeToNotifications };
