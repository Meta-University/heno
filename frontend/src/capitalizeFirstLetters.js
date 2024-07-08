export function capitalizeFirstLetters(str) {
  return str.replace(/\b\w/g, (char) => char.toUpperCase());
}
