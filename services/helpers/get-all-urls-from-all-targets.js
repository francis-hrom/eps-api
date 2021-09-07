const Target = require('../../models/target');

module.exports = async () => {
  const targets = await Target.find({}).lean();
  const urls = new Set();

  targets.forEach((target) => urls.add(target.url));

  return [...urls];
};
