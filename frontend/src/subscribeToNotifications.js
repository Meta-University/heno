import io from "socket.io-client";

import { SOCKET_URL } from "./config";
const socket = io(SOCKET_URL, {
  withCredentials: true,
});

function subscribeToNotifications(userId, callback) {
  socket.on(`notifications-${userId}`, (notification) => {
    callback(notification);
  });
}

export { subscribeToNotifications };
