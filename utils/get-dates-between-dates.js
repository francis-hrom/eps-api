const isValidDate = require('./is-valid-date');

module.exports = (startDate, endDate) => {
  if (!isValidDate(startDate)) {
    throw new Error('Invalid startDate');
  }
  if (!isValidDate(endDate)) {
    throw new Error('Invalid endDate');
  }

  let dates = [];
  //to avoid modifying the original date
  const theDate = new Date(startDate);
  const lastDate = new Date(endDate);

  while (theDate < lastDate) {
    dates = [...dates, new Date(theDate).toISOString().slice(0, 10)];
    theDate.setDate(theDate.getDate() + 1);
  }
  dates = [...dates, endDate];
  return dates;
};
