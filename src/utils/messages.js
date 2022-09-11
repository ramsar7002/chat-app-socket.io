const generateMessage = (text) => {
  return {
    text,
    createdAt: new Date().getTime(),
  };
};

const generateLocationMessage = (location) => {
  return {
    location: location,
    createdAt: new Date().getTime(),
  };
};

module.exports = {
  generateMessage,
  generateLocationMessage,
};
