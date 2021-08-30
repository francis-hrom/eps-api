const Target = require('../../models/target');
const cleanup = require('./cleanup');

module.exports = async () => {
  const targets = await Target.find({}).lean();

  //targets.forEach((target) => cleanup(target));

  return targets;
};
