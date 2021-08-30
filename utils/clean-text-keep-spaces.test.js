const cleanTextKeepSpaces = require('./clean-text-keep-spaces');

describe('clean-text-keep-spaces.js', () => {
  test('cleanTextKeepSpaces function exists', () => {
    expect(typeof cleanTextKeepSpaces).toEqual('function');
  });

  test('Returns correct string', () => {
    expect(
      cleanTextKeepSpaces("ADA'S -’'ä™:&,! ´áóñí.–+()ēǎǔ`?â example")
    ).toEqual('adas example');
  });

  test('should throw an error if called with number (which is not a string)', () => {
    expect(() => {
      cleanTextKeepSpaces(123456);
    }).toThrow(TypeError);
  });
});
