const onlineUsers = new Map();

export const socketHandler = (io) => {
  io.on("connection", (socket) => {
    console.log("Socket connected:", socket.id);

    // user joins with own id
    socket.on("join", (userId) => {
      onlineUsers.set(userId.toString(), socket.id);

      console.log(
        "User joined:",
        userId,
        socket.id
      );
    });

    // send message in real time
    socket.on("sendMessage", (data) => {
      const receiverSocketId =
        onlineUsers.get(
          data.receiverId.toString()
        );

      if (receiverSocketId) {
        io.to(receiverSocketId).emit(
          "receiveMessage",
          data
        );
      }
    });

    // remove disconnected user
    socket.on("disconnect", () => {
      for (const [userId, socketId] of onlineUsers.entries()) {
        if (socketId === socket.id) {
          onlineUsers.delete(userId);
          break;
        }
      }

      console.log(
        "Socket disconnected:",
        socket.id
      );
    });
  });
};