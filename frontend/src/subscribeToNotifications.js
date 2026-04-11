import io from "socket.io-client";
import { SOCKET_URL } from "./config";

let socket;

function getSocket() {
  if (!socket) {
    socket = io(SOCKET_URL, {
      withCredentials: true,
    });
  }
  return socket;
}

/**
 * Subscribe to real-time notifications for a user. Returns an unsubscribe function.
 */
function subscribeToNotifications(userId, callback) {
  if (userId == null) {
    return () => {};
  }
  const s = getSocket();
  const event = `notifications-${userId}`;
  s.on(event, callback);
  return () => {
    s.off(event, callback);
  };
}

export { subscribeToNotifications, getSocket };
