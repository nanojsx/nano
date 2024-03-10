// @ts-check

import path from 'path'
import { mime } from './mime.mjs'
import { readFile } from 'fs/promises'
import { dirname, join } from 'path'
import { fileURLToPath } from 'url'
import { NYC } from './nyc.mjs'

const __filename = fileURLToPath(import.meta.url)
const __dirname = dirname(__filename)

const testerJS = await readFile(join(__dirname, './tester.js'), { encoding: 'utf-8' })

export const totalPasses = [0, 0]

/** @type {Array<{text:string, id: number, type?: string}>} */
let _messages = []

const sendMessages = () => {
  _messages
    .sort((a, b) => a.id - b.id)
    .forEach(m => {
      if (m.type === 'end') {
        const match = m.text.match(/(\d+)\/(\d+).passing/m)
        if (match) {
          totalPasses[0] += parseInt(match[1])
          totalPasses[1] += parseInt(match[2])
        }
      }

      // log the text (with 2 spaces more)
      console.log(
        m.text
          .split('\n')
          .map(l => `  ${l}`)
          .join('\n')
      )
    })

  _messages = []
}

const queueMessages = message => {
  _messages.push(message)

  setTimeout(() => {
    sendMessages()
  }, 100)
}

export const requestListener = ({ serve, collectCoverage }) => {
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

        // tester.js
        if (req.url === '/tester.js') {
          return res.writeHead(200, { 'Content-Type': contentType }).end(testerJS)
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
        if (!err.message.endsWith(".ico'")) {
          console.log('Error:', err.message)
        }
        return res.writeHead(500).end()
      }
    }

    return res.writeHead(400).end()
  }
}
