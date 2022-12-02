export function splitStringCamelCase(word: string) {
  const words = [word[0]];

  for (let i = 1, y = 0; i < word.length; i++) {
    if (word[i] === word[i].toUpperCase()) {
      y++;
      words[y] = word[i];
    } else {
      words[y] += word[i];
    }
  }

  return words;
}

export function wordsToLabel(words: string[]) {
  return words && words.length > 0
    ? words
        .map((w) => w.trim())
        .map((w) => w.charAt(0).toUpperCase() + w.slice(1))
        .join(" ")
    : "";
}

export function keyToLabel(key: string) {
    return wordsToLabel(splitStringCamelCase(key))
}
