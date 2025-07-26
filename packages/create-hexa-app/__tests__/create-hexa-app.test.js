const { createHexaApp } = require("../dist/create-hexa-app.js");

test("createHexaApp", () => {
  expect(createHexaApp()).toBe("Creating Hexa Js App");
});
