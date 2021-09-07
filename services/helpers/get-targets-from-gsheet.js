require('dotenv').config();
const axios = require('axios');
const GSHEET = process.env.GSHEET;

module.exports = async () => {
  const response = await axios.get(GSHEET);
  return response.data.rows;
};
