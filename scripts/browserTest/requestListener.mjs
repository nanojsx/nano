import path from 'path'
import { mime } from './mime.mjs'
import { readFile } from 'fs/promises'
import { spawn } from 'child_process'
import { dirname, join } from 'path'
import { fileURLToPath } from 'url'
import { NYC } from './nyc.mjs'

const __filename = fileURLToPath(import.meta.url)
const __dirname = dirname(__filename)

const testerJS = await readFile(join(__dirname, './tester.js'), { encoding: 'utf-8' })

let _messages = []
const sendMessages = () => {
  _messages
    .sort((a, b) => {
      a.id - b.id
    })
    .forEach(m => {
      console.log(m.text)
    })

  _messages = []
}
const queueMessages = message => {
  _messages.push(message)

  setTimeout(() => {
    sendMessages()
  }, 100)
}

export const requestListener = collectCoverage => {
  return async (req, res) => {
    if (req.method === 'POST') {
      let data = ''
      req.on('data', chunk => {
        data += chunk
      })
      req.on('end', () => {
        const message = JSON.parse(data)
        queueMessages(message)
        res.end()
      })
      return
    }

    if (req.method === 'GET') {
      try {
        const filePath = path.join(path.resolve(), req.url)
        const contentType = mime(req.url)

        // /tester.js
        if (req.url === '/tester.js') {
          res.writeHead(200, { 'Content-Type': contentType }).end(testerJS)
        }
        // Will instrument all javascript files not containing "instrumented"
        else if (collectCoverage && contentType === 'application/javascript' && !/instrumented/.test(filePath)) {
          const myOptions = ''
          res.writeHead(200, { 'Content-Type': contentType })
          NYC.instrument(filePath, res)
          return
        }
        // else
        else {
          const file = await readFile(filePath, { encoding: 'utf-8' })
          if (!file) return res.writeHead(404).end()
          return res.writeHead(200, { 'Content-Type': contentType }).end(file)
        }
      } catch (err) {
        console.log('Error:', err.message)
        return res.writeHead(500).end()
      }
    }

    return res.writeHead(400).end()
  }
}
