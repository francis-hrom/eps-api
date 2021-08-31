const getTargetsFromGsheet = require('./get-targets-from-gsheet');

describe('get-targets-from-gsheet.js', () => {
  beforeAll(async () => {
    jest.resetAllMocks();
  });

  test('getTargetsFromGsheet function exists', () => {
    expect(typeof getTargetsFromGsheet).toEqual('function');
  });

  test('return some data', async () => {
    const data = await getTargetsFromGsheet();

    expect(data).toBeDefined();
    expect(data.length).toBeGreaterThan(0);
  });
});
