const Target = require('../../models/target');

module.exports = async (url, selector) => {
  const target = new Target({
    url: url.replace(/ /g, '').replace(/\/+$/g, '').toLowerCase(),
    selector: selector,
  });

  const newTarget = await target.save();

  return newTarget;
};
