export const getLetters = (text) =>
  text
    .trim()
    .split("")
    .filter((char) => /\p{L}/u.test(char));

export const countLetters = (letters) =>
  letters.reduce((obj, char) => {
    const upper = char.toUpperCase();
    obj[upper] = (obj[upper] || 0) + 1;
    return obj;
  }, {});

export const getWords = (text) =>
  text
    .trim()
    .split(" ")
    .filter((word) => word !== "" && word !== "\n").length;

export const excludeSpacesFrom = (text) => text.split('').filter((char) => char !== " " && char !== "\n") //prettier-ignore
export const paddStart = (value) => `${String(value).padStart(2, "0")}`;
