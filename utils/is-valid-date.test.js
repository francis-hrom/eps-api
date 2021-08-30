const isValidDate = require("./is-valid-date");

describe("is-valid-date.js", () => {
  test("isValidDate function exists", () => {
    expect(typeof isValidDate).toEqual("function");
  });

  test("Returns true", () => {
    expect(isValidDate("2021-01-20")).toEqual(true);
  });

  test("Returns false", () => {
    expect(isValidDate("20-01-2021")).toEqual(false);
  });
  test("Returns false", () => {
    expect(isValidDate("2021-02-31")).toEqual(false);
  });
});
