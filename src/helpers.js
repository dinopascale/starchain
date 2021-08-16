const getTimeStamp = () => {
  return new Date().getTime().toString().slice(0, -3);
};

const minuteToSeconds = (minutes) => {
  return minutes * 60;
};

module.exports = {
  getTimeStamp,
  minuteToSeconds,
};
