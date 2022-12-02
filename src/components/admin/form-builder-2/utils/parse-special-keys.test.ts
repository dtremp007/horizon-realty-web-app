import { parseColonKey, parseSpecialKey } from "./parse-special-keys";

describe("parseColonKey", () => {
  it("should find key value pair in string", () => {
    const str = "hello :name world";
    const result = parseColonKey(str);
    expect(result).toEqual({ name: "world" });
  });

  it("should find multiple key value pairs in string", () => {
    const str = "hello :name world :age ten";
    const result = parseColonKey(str);
    expect(result).toEqual({ name: "world", age: "ten" });
  });

  it("should parse number is present", () => {
    const str = "hello :name world :age 10";
    const result = parseColonKey(str);
    expect(result).toEqual({ name: "world", age: 10 });
  });
});

describe("parseSpecialKeys", () => {
  it("should parse special key with parameters", () => {
    const str = "(hello {:name world})";
    const result = parseSpecialKey(str);
    expect(result).toEqual({
      functionName: "hello",
      parameters: { name: "world" },
    });
  });

  it("should parse special key with no parameters", () => {
    const str = "(hello)";
    const result = parseSpecialKey(str);
    expect(result).toEqual({
      functionName: "hello",
      parameters: {},
    });
  });

  it("should parse special key with multiple parameters including numbers", () => {
    const str = "(hello {:name world :age 10})";
    const result = parseSpecialKey(str);
    expect(result).toEqual({
      functionName: "hello",
      parameters: { name: "world", age: 10 },
    });
  });
});
