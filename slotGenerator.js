import fs from 'fs';
import convertNumber from './convertNumber';
import templates from './slotTemplates'

const replaceAll = (original, root, words, digits) => {
    let result = original;
    const capFirst = (string) => {
      return string.charAt(0).toUpperCase() + string.slice(1);
    }
    const capWords = (camel = false) => {
      return words.map((w, i) => (!camel || !!i) ? capFirst(w) : w).join('');
    }
    original = original
      .replaceAll('Extra Two', `${capFirst(root)} ${capWords(false)}`)
      .replaceAll('extratwo', `${root.toLowerCase()}${words.join('').toLowerCase()}`)
      .replaceAll('ExtraTwo', `${capFirst(root)}${capWords(false)}`)
      .replaceAll('extraTwo', `${root.toLowerCase()}${capWords(true)}`)
      .replaceAll('Extra 2', `${capFirst(root)} ${digits}`)
      .replaceAll('extra2', `${root.toLowerCase}${digits}`)
      .replaceAll('Extra2', `${capFirst(root)}${digits}`);
    return original;
};

const convert = (element, start, count, root = 'extra') => {
  if (Array.isArray(element)) {
    // instead of returning a string, return an array of strings (or arrays), recursive
    return element.map((part) => convert(part, num, root));
  }
  const result = [];
  for (let i = start; i < i + count; i++) {
    const numParts = convertNumber(i);
    result.push(replaceAll(element, 'extra', numParts, i));
  }
  return result;
};

const result = Object.keys(templates).reduce((acc, key) => {
  acc[key] = convert(templates[key], 32, 9);
}, {});

console.log(JSON.stringify(result, null, 2));