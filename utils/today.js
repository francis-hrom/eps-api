//format YYYY-MM-DD

module.exports = () => new Date().toISOString().slice(0, 10);
