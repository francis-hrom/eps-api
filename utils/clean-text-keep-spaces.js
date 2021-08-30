module.exports = (string) => {
  if (typeof string !== 'string') {
    throw new TypeError(`${string} is not a string`);
  }

  return string
    .replace(/['’`´]/g, '')
    .replace(/[^a-zA-Z0-9]/g, ' ')
    .replace(/  +/g, ' ')
    .toLowerCase()
    .trim();
};
