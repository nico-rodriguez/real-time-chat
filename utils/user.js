const users = [];

// Join user to chat room
function joinUser(id, username, room) {
  const user = { id, username, room };
  users.push(user);
  return user;
}

// Get the current user
function getUserById(id) {
  return users.find((user) => user.id === id);
}

// User leaves the chat
function userLeave(id) {
  const index = users.findIndex((user) => user.id === id);

  if (index !== -1) {
    return users.splice(index, 1)[0];
  }
}

// Get users in the room
function getRoomUsers(room) {
  return users.filter((user) => user.room === room);
}

module.exports = { joinUser, getUserById, userLeave, getRoomUsers };
