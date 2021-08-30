const isValidDate = require('./is-valid-date');

module.exports = (dateString, numDays) => {
  if (typeof dateString !== 'string') {
    throw new TypeError(`${dateString} is not a string`);
  }

  if (!isValidDate(dateString)) {
    throw new TypeError(
      `${dateString} is invalid date or invalid format (required YYYY-MM-DD).`
    );
  }

  if (typeof numDays !== 'number') {
    throw new TypeError(`${numDays} is not a number`);
  }

  if (!Number.isSafeInteger(numDays)) {
    throw new TypeError(`${numDays} is not safe integer.`);
  }

  if (numDays === 0) {
    throw new TypeError(`numDays input can not be zero.`);
  }

  const date = new Date(dateString);
  const otherDate = new Date(date);
  otherDate.setDate(otherDate.getDate() + numDays);

  return otherDate.toISOString().slice(0, 10);
};
