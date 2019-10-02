export default function startsWith(str, word) {
  return str.lastIndexOf(word, 0) === 0;
}