const Target = require('../../models/target');

module.exports = async () => {
  const urls = await Target.find({}).distinct('url').lean();

  if (urls.length === 0) {
    throw new Error('No targets found.');
  }

  return urls;
};
