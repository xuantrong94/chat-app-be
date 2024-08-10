const socketManager = (io) => {
  io.on('connection', (socket) => {
    console.log('New client connected');

    // Xử lý sự kiện join room
    socket.on('join', (roomId) => {
      socket.join(roomId);
      console.log(`User joined room ${roomId}`);
    });

    // Xử lý sự kiện gửi tin nhắn
    socket.on('sendMessage', async (data) => {
      try {
        // Lưu tin nhắn vào database
        const newMessage = new Message({
          conversation: data.roomId,
          sender: data.userId,
          content: data.message,
        });
        await newMessage.save();

        // Gửi tin nhắn đến tất cả người dùng trong phòng
        io.to(data.roomId).emit('message', {
          _id: newMessage._id,
          userId: data.userId,
          username: data.username,
          message: data.message,
          createdAt: newMessage.createdAt,
        });
      } catch (error) {
        console.error('Error sending message:', error);
      }
    });

    // Xử lý sự kiện typing
    socket.on('typing', (data) => {
      socket.to(data.roomId).emit('userTyping', {
        userId: data.userId,
        username: data.username,
      });
    });

    // Xử lý sự kiện ngừng typing
    socket.on('stopTyping', (data) => {
      socket.to(data.roomId).emit('userStopTyping', {
        userId: data.userId,
      });
    });

    // Xử lý sự kiện ngắt kết nối
    socket.on('disconnect', () => {
      console.log('Client disconnected');
    });
  });
};

module.exports = socketManager;
