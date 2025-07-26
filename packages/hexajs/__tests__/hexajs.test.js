const { hexajs } = require("../dist/hexajs.js");

test("hexajs", () => {
  expect(hexajs()).toBe("Hello from hexajs");
});
