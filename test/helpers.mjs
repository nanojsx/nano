export const toSingleLine = str => {
  return str
    .split(/\r\n|\n|\r/gm)
    .map(l => l.trim())
    .join('')
}
