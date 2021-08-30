const mongoose = require('mongoose');
const Target = require('./target');

const targetData = {
  url: 'https://example.com',
  selector: 'div>h1>span',
};

describe('Target Model Test', () => {
  beforeAll(async () => {
    await mongoose.connect(global.__MONGO_URI__, {
      useNewUrlParser: true,
      useCreateIndex: true,
      useUnifiedTopology: true,
    });
  });

  it('create & save target successfully', async () => {
    const validTarget = new Target({
      url: targetData.url,
      selector: targetData.selector,
    });
    const savedTarget = await validTarget.save();

    expect(savedTarget._id).toBeDefined();
    expect(savedTarget.url).toBe(targetData.url);
    expect(savedTarget.selector).toBe(targetData.selector);
  });

  it('does not allow to save duplicate url', async () => {
    const targetWithInvalidField = new Target({
      url: targetData.url,
      selector: targetData.selector,
    });
    let err;
    try {
      const savedTargetWithInvalidField = await targetWithInvalidField.save();
    } catch (error) {
      err = error;
    }
    expect(err).toBeInstanceOf(Error);
  });

  it('create target without required field should failed', async () => {
    const targetWithoutRequiredField = new Target({
      selector: targetData.selector,
    });
    let err;
    try {
      const savedTargetWithoutRequiredField =
        await targetWithoutRequiredField.save();
      error = savedTargetWithoutRequiredField;
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
