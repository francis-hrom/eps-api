const otherDate = require('./other-date');

describe('other-date.js', () => {
  test('otherDate function exists', () => {
    expect(typeof otherDate).toEqual('function');
  });

  test('Returns correct date', () => {
    expect(otherDate('2020-03-01', -1)).toEqual('2020-02-29');
  });

  test('Returns correct date', () => {
    expect(otherDate('2021-02-28', 2)).toEqual('2021-03-02');
  });

  test('should throw an error if called with dateString which is not a string', () => {
    expect(() => {
      otherDate(20210228);
    }).toThrow(TypeError);
  });

  test('should throw an error if called with invalid date', () => {
    expect(() => {
      otherDate('2021-02-36', 1);
    }).toThrow(TypeError);
  });

  test('should throw an error if called with invalid date format', () => {
    expect(() => {
      otherDate('2021/02/28', 1);
    }).toThrow(TypeError);
  });

  test('should throw an error if called with numDays which is not a number', () => {
    expect(() => {
      otherDate('2021-02-28', '1');
    }).toThrow(TypeError);
  });

  test('should throw an error if called with numDays which is not a safe integer', () => {
    expect(() => {
      otherDate('2021-02-28', 1.5);
    }).toThrow(TypeError);
  });

  test('should throw an error if called with numDays which is a zero', () => {
    expect(() => {
      otherDate('2021-02-28', 0);
    }).toThrow(TypeError);
  });
});
