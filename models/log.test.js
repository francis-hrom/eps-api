const mongoose = require('mongoose');
const Log = require('./log');

const logData = {
  level: 'INFO',
  message: 'Test log message',
  details: 'Test details message',
};

describe('Log Model Test', () => {
  beforeAll(async () => {
    await mongoose.connect(global.__MONGO_URI__, {
      useNewUrlParser: true,
      useCreateIndex: true,
      useUnifiedTopology: true,
    });
  });

  it('create & save log successfully', async () => {
    const validLog = new Log({
      level: logData.level,
      message: logData.message,
      details: logData.details,
    });
    const savedLog = await validLog.save();

    expect(savedLog._id).toBeDefined();
    expect(savedLog.level).toBe(logData.level);
    expect(savedLog.message).toBe(logData.message);
    expect(savedLog.details).toBe(logData.details);
  });

  it('insert log successfully, but the field does not defined in schema should be undefined', async () => {
    const logWithInvalidField = new Log({
      level: logData.level,
      message: logData.message,
      details: logData.details,
      type: 'undefined in schema',
    });
    const savedLogWithInvalidField = await logWithInvalidField.save();
    expect(savedLogWithInvalidField._id).toBeDefined();
    expect(savedLogWithInvalidField.type).toBeUndefined();
  });

  it('create log without required field should failed', async () => {
    const logWithoutRequiredField = new Log({ level: logData.level });
    let err;
    try {
      const savedLogWithoutRequiredField = await logWithoutRequiredField.save();
      error = savedLogWithoutRequiredField;
    } catch (error) {
      err = error;
    }
    expect(err).toBeInstanceOf(mongoose.Error.ValidationError);
  });

  afterAll(async () => {
    await mongoose.connection.db.dropDatabase();
    await mongoose.disconnect();
  });
});
