const mongoose = require('mongoose');
const User = require('./user');

const userData = {
  email: 'ada@lovelace.test',
  password: 'FIRSTprogrammer!',
};

describe('User Model Test', () => {
  beforeAll(async () => {
    await mongoose.connect(global.__MONGO_URI__, {
      useNewUrlParser: true,
      useCreateIndex: true,
      useUnifiedTopology: true,
    });
  });

  it('create & save user successfully', async () => {
    const validUser = new User({
      email: userData.email,
      password: userData.password,
    });

    const savedUser = await validUser.save();

    expect(savedUser._id).toBeDefined();
    expect(savedUser.email).toBe(userData.email);
    expect(savedUser.password).toBe(userData.password);
  });

  it('does not allow to save duplicate email', async () => {
    const userWithInvalidField = new User({
      email: userData.email,
      password: userData.password,
    });
    let err;

    try {
      const savedUserWithInvalidField = await userWithInvalidField.save();
    } catch (error) {
      err = error;
    }

    expect(err).toBeInstanceOf(Error);
  });

  it('create user without required field should failed', async () => {
    const userWithoutRequiredField = new User({
      password: userData.password,
    });
    let err;

    try {
      const savedUserWithoutRequiredField =
        await userWithoutRequiredField.save();
      error = savedUserWithoutRequiredField;
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
