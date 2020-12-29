const __dirname = (() => {
    const { url: urlStr } = import.meta;
    const url = new URL(urlStr);
    const __filename = (url.protocol === "file:" ? url.pathname : urlStr)
        .replace(/[/][^/]*$/, '');

    const isWindows = (() => {

        let NATIVE_OS: typeof Deno.build.os = "linux";
        // eslint-disable-next-line @typescript-eslint/no-explicit-any
        const navigator = (globalThis as any).navigator;
        if (globalThis.Deno != null) {
            NATIVE_OS = Deno.build.os;
        } else if (navigator?.appVersion?.includes?.("Win") ?? false) {
            NATIVE_OS = "windows";
        }

        return NATIVE_OS == "windows";

    })();

    return isWindows ?
        __filename.split("/").join("\\").substring(1) :
        __filename;
})();

import * as Nano from '../core.ts'
import { renderSSR } from '../ssr.ts'
import { Component } from '../component.ts'
import { Helmet } from '../components/helmet.ts'

// @ts-ignore
import fs from 'https://deno.land/std@0.82.0/node/fs.ts'
// @ts-ignore
import { join } from 'https://deno.land/std@0.82.0/node/path.ts'
// @ts-ignore
import http from 'http DENOIFY: DEPENDENCY UNMET (BUILTIN)'

class App extends Component {
  render() {
    return <div>Nano JSX App</div>
  }
}

const app = renderSSR(<App />)
const { body, head, footer } = Helmet.SSR(app)

let html = `
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
