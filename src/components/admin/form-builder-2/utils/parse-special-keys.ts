export function isSpecialKey(key: string): boolean {
  return key.startsWith("(") && key.endsWith(")");
}

export function extractSpecialKey(key: string): string {
  return key.slice(1, -1);
}

// Function that takes a string and extracts string between two curly braces or returns empty string if no curly braces are found
export function extractCurlyBraces(str: string): string {
  const start = str.indexOf("{");
  const end = str.indexOf("}");
  if (start === -1 || end === -1) {
    return "";
  }
  return str.slice(start + 1, end);
}

// Function takes a string and returns the first word in the string
export function getFirstWord(str: string): string {
  return str.split(" ")[0];
}

// Function that finds words starting with a colon, and the following word and turns them into key value pairs
export function parseColonKey(str: string): { [key: string]: string | number } {
  const colonRegex = /:(\w+)\s(\w+)/g;
  const matches = str.matchAll(colonRegex);
  const colonKeys: { [key: string]: string | number } = {};
  for (const match of matches) {
    const value = isNaN(+match[2]) ? match[2] : +match[2];
    colonKeys[match[1]] = value;
  }
  return colonKeys;
}

export function parseSpecialKey(str: string) {
  const specialKey = extractSpecialKey(str);
  const functionName = getFirstWord(specialKey);
  const parameterString = extractCurlyBraces(specialKey);
  const parameters = parameterString === "" ? {} : parseColonKey(parameterString);
  return { functionName, parameters };
}
