const getTimeStamp = () => {
  return new Date().getTime().toString().slice(0, -3);
};

module.exports = {
  getTimeStamp,
};
