let users = [];

//add user
const addUser = ({ id, username, room }) => {
  //Clean the data
  username = username.trim().toLowerCase();
  room = room.trim().toLowerCase();

  //validate the data
  if (!username || !room) {
    return {
      error: "username and room are required",
    };
  }

  //check for existing users
  const existingUser = users.find(
    (user) => user.username === username && user.room === room
  );

  //validate username
  if (existingUser) {
    return {
      error: "username already exist in the room, please choose another",
    };
  }

  //store user
  const user = {
    id,
    username,
    room,
  };
  users.push(user);
  return { user };
};

//remove user
const removeUser = (id) => {
  const user = users.find((user) => user.id === id);
  const usersLength = users.length;
  users = users.filter((user) => user.id !== id);
  if (users.length === usersLength) {
    return {
      error: "User not exist",
    };
  } else {
    return user;
  }
};

//get user
const getUser = (id) => {
  return users.find((user) => user.id === id);
};

//get users in room
const getUsersInRoom = ({ room }) => {
  const usersInRoom = users.filter((user) => user.room === room);
  return usersInRoom.length !== 0 ? usersInRoom : undefined;
};

module.exports = { addUser, removeUser, getUser, getUsersInRoom };
