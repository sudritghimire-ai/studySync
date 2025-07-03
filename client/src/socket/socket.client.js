import io from "socket.io-client";

const SOCKET_URL = "https://studysync-mmo6.onrender.com";  // correct backend

let socket = null;

export const initializeSocket = (userId) => {
  if (socket) {
    socket.disconnect();
  }

  socket = io(SOCKET_URL, {
    auth: { userId },
  });

  return socket; // helpful if you want to chain .on etc
};

export const getSocket = () => {
  if (!socket) {
    throw new Error("Socket not initialized");
  }
  return socket;
};

export const disconnectSocket = () => {
  if (socket) {
    socket.disconnect();
    socket = null;
  }
};

// ✅ export the socket instance so store can use it directly
export { socket };
