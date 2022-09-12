const generateMessage = (username, text) => {
  return {
    username: username?.charAt(0).toUpperCase() + username?.slice(1),
    text,
    createdAt: new Date().getTime(),
  };
};

const generateLocationMessage = (username, location) => {
  return {
    username: username?.charAt(0).toUpperCase() + username.slice(1),
    location: location,
    createdAt: new Date().getTime(),
  };
};

module.exports = {
  generateMessage,
  generateLocationMessage,
};
