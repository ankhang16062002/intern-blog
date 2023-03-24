exports.addUser = (userInfo, socketId, onlineUsers) => {
  !onlineUsers.some((user) => user.id === userInfo.id) &&
    onlineUsers.push({
      id: userInfo.id,
      name: userInfo.name,
      avatar: userInfo.avatar,
      loginAt: Date.now(),
      socketId,
    });
};

exports.removeUser = (socketId, onlineUsers) => {
  const index = onlineUsers.findIndex((user) => user.socketId === socketId);
  onlineUsers.splice(index, 1);
};

exports.findUserOnline = (userReceviedId, onlineUsers) => {
  const user = onlineUsers.find((user) => user.id === userReceviedId);
  return user;
};
