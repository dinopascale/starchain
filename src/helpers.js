const getTimeStamp = () => {
  return new Date().getTime().toString().slice(0, -3);
};

const minuteToMilliseconds = (minutes) => {
  return minutes * 60 * 1000;
};

module.exports = {
  getTimeStamp,
  minuteToMilliseconds,
};
