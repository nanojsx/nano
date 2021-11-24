import path from 'path'
import { mime } from './mime.mjs'
import { readFile } from 'fs/promises'
import { spawn } from 'child_process'

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
        const contentType = mime(filePath)

        // Will instrument all javascript files not containing "instrumented"
        if (collectCoverage && contentType === 'application/javascript' && !/instrumented/.test(filePath)) {
          const myOptions = ''
          res.writeHead(200, { 'Content-Type': contentType })
          const isWin = process.platform === 'win32'
          if (isWin) spawn('powershell.exe', ['npx', 'nyc', 'instrument', filePath]).stdout.pipe(res)
          else spawn('npx', ['nyc', 'instrument', filePath]).stdout.pipe(res)
          return
        } else {
          const file = await readFile(filePath, { encoding: 'utf-8' })
          if (!file) return res.writeHead(404).end()
          return res.writeHead(200, { 'Content-Type': contentType }).end(file)
        }
      } catch (err) {
        console.log('Error:', err.message)
        return res.writeHead(500).end()
      }
    }

    console.log(400)
    return res.writeHead(400).end()
  }
}
