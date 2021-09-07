const Target = require('../models/target');
const validUrl = require('valid-url');

module.exports = (url, selector) => {
  if (!validUrl.isUri(url)) throw new TypeError(`${url} is not valid URL.`);

  return async () => {
    const target = new Target({ url: url.toLowerCase(), selector });

    const newTarget = await target.save();

    return newTarget;
  };
};
