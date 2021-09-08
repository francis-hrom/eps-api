const mongoose = require('mongoose');
const ItemProvider = require('./itemProvider');

describe('ItemProvider Model Test', () => {
  const item = 'Item Test';
  const item_clean = 'itemtest';
  const provider = 'Provider Test';
  const provider_clean = 'providertest';
  const source = 'https://example.com';

  beforeAll(async () => {
    await mongoose.connect(global.__MONGO_URI__, {
      useNewUrlParser: true,
      useCreateIndex: true,
      useUnifiedTopology: true,
    });
  });

  it('create & save itemProvider successfully', async () => {
    const validItemProvider = new ItemProvider({
      item,
      item_clean,
      provider,
      provider_clean,
      source,
    });
    const savedItemProvider = await validItemProvider.save();

    expect(savedItemProvider._id).toBeDefined();
    expect(savedItemProvider.XXX).toBe(item);
    expect(savedItemProvider.XXX).toBe(item_clean);
    expect(savedItemProvider.XXX).toBe(provider);
    expect(savedItemProvider.XXX).toBe(provider_clean);
    expect(savedItemProvider.XXX).toBe(source);
  });

  it('does not allow to save duplicate item_clean', async () => {
    const itemProviderWithInvalidField = new ItemProvider({
      item,
      item_clean,
      provider,
      provider_clean,
      source,
    });
    let err;

    try {
      const savedItemProviderWithInvalidField =
        await itemProviderWithInvalidField.save();
    } catch (error) {
      err = error;
    }

    expect(err).toBeInstanceOf(Error);
  });

  it('create itemProvider without required field should failed', async () => {
    const itemProviderWithoutRequiredField = new ItemProvider({ item });
    let err;

    try {
      const savedItemProviderWithoutRequiredField =
        await itemProviderWithoutRequiredField.save();
      error = savedItemProviderWithoutRequiredField;
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
