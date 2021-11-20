import * as Nano from '../core'
import { renderSSR } from '../ssr'
import { Component } from '../component'
import { Helmet } from '../components/helmet'

// @ts-ignore
import fs from 'fs'
// @ts-ignore
import { join } from 'path'
// @ts-ignore
import http from 'http'

class App extends Component {
  render() {
    return <div>Nano JSX App</div>
  }
}

const app = renderSSR(<App />)
const { body, head, footer } = Helmet.SSR(app)

const html = `
<!DOCTYPE html>
<html lang="en">
  <head>
    <meta name="viewport" content="width=device-width, initial-scale=1.0" />
    <style>
      body { 
        font-family: BlinkMacSystemFont, -apple-system, 'Segoe UI', Roboto, Oxygen, Ubuntu, Cantarell, 'Fira Sans', 'Droid Sans', 'Helvetica Neue', Helvetica, Arial, sans-serif;
      }
     </style>
    ${head.join('\n')}
  </head>
  <body>
    <div id="root">
      ${body}
    </div>
  </body>
  ${footer.join('\n')}
</html>
`

// minify
// html = html.replace(/[\s]+/gm, ' ')

http
  .createServer((req: any, res: any) => {
    const { url } = req

    if (/\.html$/.test(url)) return res.end(html)

    // @ts-ignore
    const path = join(__dirname, '../../', url)

    fs.readFile(path, (err: any, data: any) => {
      if (err) {
        res.writeHead(404)
        return res.end(data)
      }
      const type = /\.png$/.test(url) ? 'image/png' : 'image/svg+xml'
      res.setHeader('Content-Type', type)
      return res.end(data)
    })
  })
  .listen(8080, () => console.log('open http://localhost:8080/index.html in your browser'))
