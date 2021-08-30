const cleanTextRemoveSpaces = require('./clean-text-remove-spaces');

describe('clean-text-remove-spaces.js', () => {
  test('cleanTextRemoveSpaces function exists', () => {
    expect(typeof cleanTextRemoveSpaces).toEqual('function');
  });

  test('Returns correct string', () => {
    expect(
      cleanTextRemoveSpaces("ADA'S -’'ä™:&,! ´áóñí.–+()ēǎǔ`?â example")
    ).toEqual('adasexample');
  });

  test('should throw an error if called with number (which is not a string)', () => {
    expect(() => {
      cleanTextRemoveSpaces(123456);
    }).toThrow(TypeError);
  });
});
