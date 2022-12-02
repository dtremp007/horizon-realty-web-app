import { createPathSnowball } from ".";
import { describe, expect, test } from "@jest/globals";

it("supports the typical use case", () => {
  const pathSnowball = createPathSnowball({});

  const c = pathSnowball("filterProps");
  const c1 = c("data");

  expect(c1()).toBe("filterProps.data");
});

it("supports multiple arguments", () => {
  const pathSnowball = createPathSnowball({});

  const c = pathSnowball("filterProps", "data");
  const c1 = c("1", "value");

  expect(c1()).toBe("filterProps.data.1.value");
});

it("supports passing an empty string", () => {
  const pathSnowball = createPathSnowball({});

  const c = pathSnowball("filterProps");
  const c1 = c("");
  const c2 = c1("data");

  expect(c2()).toBe("filterProps.data");
});

it("supports being called on empty more than once", () => {
  const pathSnowball = createPathSnowball({});

  const c = pathSnowball("filterProps");
  const c1 = c("data");

  expect(c1()).toBe("filterProps.data");
  expect(c1()).toBe("filterProps.data");
});

it("supports being called, and then continuing to snowball", () => {
  const pathSnowball = createPathSnowball({});

  const c = pathSnowball("filterProps");
  const c1 = c("data");

  expect(c1()).toBe("filterProps.data");

  const c2 = c1("1");

  expect(c2()).toBe("filterProps.data.1");
});

it("pathSnowball can be called immediately", () => {
  const pathSnowball = createPathSnowball({});

  expect(pathSnowball()).toBe("");
});

it("supports being called twice in a row", () => {
  const pathSnowball = createPathSnowball({});

  expect(pathSnowball("title")()).toBe("title");
})
