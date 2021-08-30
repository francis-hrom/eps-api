const mongoose = require('mongoose');
const addLog = require('./add-log');

const logData = {
  level: 'INFO',
  message: 'Test log message',
  details: 'Test details message',
};

describe('add-log.js', () => {
  beforeAll(async () => {
    await mongoose.connect(global.__MONGO_URI__, {
      useNewUrlParser: true,
      useCreateIndex: true,
      useUnifiedTopology: true,
    });
  });

  test('addLog function exists', () => {
    expect(typeof addLog).toEqual('function');
  });

  it('create & save log successfully', async () => {
    const savedLog = await addLog(
      logData.level,
      logData.message,
      logData.details
    );

    expect(savedLog._id).toBeDefined();
    expect(savedLog.level).toBe(logData.level);
    expect(savedLog.message).toBe(logData.message);
    expect(savedLog.details).toBe(logData.details);
  });

  afterAll(async () => {
    await mongoose.connection.db.dropDatabase();
    await mongoose.disconnect();
  });
});
