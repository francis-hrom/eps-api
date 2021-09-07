const Log = require("../../models/log");

module.exports = async (level, message, details) => {
  const log = new Log({ level, message, details });
  const newLog = await log.save();
  return newLog;
};
