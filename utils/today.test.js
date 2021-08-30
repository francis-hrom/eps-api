const today = require('./today');

describe('today.js', () => {
  test('today function exists', () => {
    expect(typeof today).toEqual('function');
  });

  test('Returns correct date', () => {
    const date = new Date();

    const year = date.getFullYear();
    const month = (date.getMonth() + 1).toString();
    const day = date.getDate().toString();

    const twoDigits = (num) => (num.length < 2 ? `0${num}` : num);

    const expectedDate = `${year}-${twoDigits(month)}-${twoDigits(day)}`;
    expect(today()).toEqual(expectedDate);
  });
});
