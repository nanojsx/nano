import path, { extname } from 'path'

// https://github.com/nanojsx/nano/blob/master/tinyServer/index.ts
export const mime = fileName => {
  switch (extname(fileName)) {
    case '.css':
      return 'text/css'
    case '.js':
      return 'application/javascript'
    case '.html':
      return 'text/html'
    case '.json':
      return 'application/json'
    case '.jpg':
    case '.jpeg':
      return 'image/jpeg'
    case '.png':
      return 'image/png'
    case '.svg':
    case '.svgz':
      return 'image/svg+xml'
    default:
      return 'text/plain'
  }
}
