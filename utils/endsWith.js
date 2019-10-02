export default function endsWith(str, word) {
  return str.indexOf(word, str.length - word.length) !== -1;
}