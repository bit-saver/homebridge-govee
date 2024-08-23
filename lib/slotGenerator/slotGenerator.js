import fs from 'node:fs'

import convertNumber from './convertNumber.js'
import templates from './slotTemplates.js'

function replaceAll(original, root, words, digits) {
  let result = original
  const capFirst = (string) => {
    return string.charAt(0).toUpperCase() + string.slice(1)
  }
  const capWords = (camel = false) => {
    return words.map((w, i) => (!camel || !!i) ? capFirst(w) : w).join('')
  }
  result = original
    .replaceAll('Extra Two', `${capFirst(root)} ${capWords(false)}`)
    .replaceAll('extratwo', `${root.toLowerCase()}${words.join('').toLowerCase()}`)
    .replaceAll('ExtraTwo', `${capFirst(root)}${capWords(false)}`)
    .replaceAll('extraTwo', `${root.toLowerCase()}${capWords(true)}`)
    .replaceAll('Extra 2', `${capFirst(root)} ${digits}`)
    .replaceAll('extra2', `${root.toLowerCase}${digits}`)
    .replaceAll('Extra2', `${capFirst(root)}${digits}`)
  return result.trim()
}

function convert(element, start, count = 1, root = 'extra') {
  if (Array.isArray(element)) {
    // instead of returning a string, return an array of strings (or arrays), recursive
    return element.map(part => convert(part, start, count, root))
  }
  const result = []
  for (let i = start; i < start + count; i++) {
    const numParts = convertNumber(i)
    result.push(replaceAll(element, 'extra', numParts, i))
  }
  return result
}

function pad(str, char, len) {
  return str.padStart(str.length + Math.floor((len - str.length) / 2), char).padEnd(len, char)
}

function printSection(key, data) {
  const lines = [
    '******************************',
    `${pad(pad(key, ' ', key.length + 2), '*', 30)}`,
    '******************************',
  ]
  if (!data) {
    return lines
  }
  const addLines = (parts) => {
    if (Array.isArray(parts)) {
      parts.forEach(addLines)
    } else {
      lines.push(parts)
    }
  }
  addLines(data)
  return lines
}

function printer(data) {
  const lines = []
  Object.keys(data).forEach((key) => {
    lines.push(...printSection(key, data[key]))
  })
  const file = fs.createWriteStream('slots.txt')
  lines.forEach(line => file.write(`${line}\n`))
  file.end()
}

const result = Object.keys(templates).reduce((acc, key) => {
  acc[key] = convert(templates[key], 32, 8)
  return acc
}, {})
// console.log(convert(templates['utils/custom-chars.js'], 32, 8))
printer(result)
