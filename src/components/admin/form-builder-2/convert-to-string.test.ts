import { keyToLabel, splitStringCamelCase, wordsToLabel } from "./convert-to-label";

describe("@form-builder/splitStringCamelCase", () => {
  it("Splits camelCase into seperate words", () => {
    expect(splitStringCamelCase("camelCase")).toEqual(["camel", "Case"]);
  });

  it("Handles a more complex case", () => {
    expect(splitStringCamelCase("ACamelCase")).toEqual(["A", "Camel", "Case"]);
  });
});

describe("@form-builder/wordsToLabel", () => {
  it("Joins words with space, and capatalizes first letter.", () => {
    expect(wordsToLabel(["a", "short", "sentence"])).toBe("A Short Sentence");
  });

  it("Can handle a single word", () => {
    expect(wordsToLabel(["a"])).toBe("A");
  });

  it("It takes care of white space", () => {
    expect(wordsToLabel(["a", " short ", " sentence "])).toBe("A Short Sentence");
  });

  it("Handles no argument and empty array", () => {
    // @ts-ignore
    expect(wordsToLabel()).toBe("");
    expect(wordsToLabel([])).toBe("");
  });
});

describe("@form-builder/keyToLabel", () => {
  it("Turn camelCase word into a label", () => {
    expect(keyToLabel("camelCase")).toBe("Camel Case");
  });
});
