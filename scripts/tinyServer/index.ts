/* eslint-disable no-redeclare */
import { createReadStream } from 'fs'
import { createServer, IncomingMessage, Server, ServerResponse } from 'http'
import { basename, extname, join, resolve } from 'path'
import { readdir, stat } from 'fs/promises'
import { types } from 'util'

const { isPromise } = types

export const makeHtml = (body: string) => `<!DOCTYPE html>
<html>
  <head>
    <meta charset="UTF-8" />
    <meta http-equiv="X-UA-Compatible" content="IE=edge" />
    <meta name="viewport" content="width=device-width, initial-scale=1.0" />
  </head>
  <body>
    ${body}
  </body>
</html>`

// https://github.com/nginx/nginx/blob/master/conf/mime.types
const mime = (fileName: string) => {
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

export type Path = string | RegExp
export type Method = 'any' | 'get' | 'patch' | 'post' | 'put' | 'delete'

export class Request extends IncomingMessage {
  url!: string
  params: { [param: string]: string } = {}
  route!: Omit<Route, 'handler'>
}

export class Response extends ServerResponse {
  public status(statusCode: number) {
    this.statusCode = statusCode
    return this
  }

  private __send(body: string, contentType = 'text/plain') {
    this.writeHead(this.statusCode || 200, { 'Content-Type': contentType })
    this.end(body)
  }

  public get send() {
    return {
      html: (html: string) => {
        this.__send(html, 'text/html')
      },
      text: (text: string) => {
        this.__send(text, 'text/plain')
      },
      json: (json: object) => {
        this.__send(JSON.stringify(json), 'application/json')
      },
      /**
       * Send a file.
       * Pass a relativePath (without leading slash) or an absolute path
       *
       * @example
       * // absolute path
       * res.send.file(join(resolve(), 'assets/styles.css')))
       * // relative path
       * res.send.file('assets/styles.css')
       */
      file: async (filePath: string) => {
        let isFile = false
        try {
          // check file
          const stats = await stat(filePath)
          isFile = stats.isFile()
          if (!isFile) return new Error()

          // prepare response
          const contentType = mime(filePath)
          this.writeHead(200, { 'Content-Type': contentType })

          // send file
          createReadStream(filePath).pipe(this, { end: true })
        } catch (err: any) {
          return err
        }
      }
    }
  }
}

export type Context = {
  req: Request
  res: Response
}

export interface Handler {
  (ctx: Context): void | Promise<any>
}
export interface ExpressHandler {
  (req: Request, res: Response, next: Function): void | Promise<any>
}

interface Route {
  handler: Handler | ExpressHandler
  path: Path
  method?: Method
  isMiddleware?: boolean
}
export type Routes = (Route | Handler)[]

type UseMiddleware = {
  (handler: ExpressHandler): void
  (path: Path, handler: ExpressHandler): void
}

export class Router {
  private _routes: Routes = []

  get route() {
    /** Add a middleware */
    const use: UseMiddleware = (a: Path | ExpressHandler, b?: ExpressHandler): void => {
      if (typeof a === 'string' && typeof b === 'function') {
        this.routes.add({ path: a, handler: b, isMiddleware: true })
      } else if (a instanceof RegExp && typeof b === 'function') {
        this.routes.add({ path: a, handler: b, isMiddleware: true })
      } else if (typeof a === 'function') {
        this.routes.add({ path: '/', handler: a, isMiddleware: true })
      }
    }

    return {
      use: use,
      add: (method: Method, path: Path, handler: Handler) => {
        this.routes.add({ method, path, handler })
      },
      any: (path: Path, handler: Handler) => this.route.add('any', path, handler),
      get: (path: Path, handler: Handler) => this.route.add('get', path, handler),
      patch: (path: Path, handler: Handler) => this.route.add('patch', path, handler),
      post: (path: Path, handler: Handler) => this.route.add('post', path, handler),
      put: (path: Path, handler: Handler) => this.route.add('put', path, handler),
      delete: (path: Path, handler: Handler) => this.route.add('delete', path, handler)
    }
  }

  get routes() {
    return {
      add: (route: Handler | Route) => {
        // if has params, convert to RegEx
        if (typeof route !== 'function' && typeof route.path === 'string' && route.path.includes('/:')) {
          try {
            route.path = route.path.replace('/', '\\/')
            route.path = route.path.replace(/\/:([^/]+)/gm, '\\/(?<$1>[^\\/]+)')
            route.path = new RegExp(`^${route.path}$`, 'gm')
          } catch (err: any) {
            console.log('Warn:', err.message)
          }
        }
        this._routes.push(route)
      }
    }
  }

  async handle(req: Request, res: Response) {
    const method = req.method?.toLowerCase() as Method

    routesLoop: for (let i = 0; i < this._routes.length; i++) {
      if (res.headersSent) break routesLoop

      const route = this._routes[i]
      const url = req.url as string
      const pathIsRegex = typeof route !== 'function' && route.path instanceof RegExp && url.match(route.path) !== null
      const pathIsExact = typeof route !== 'function' && route.path === req.url
      const pathMatches = typeof route !== 'function' && typeof route.path === 'string' && url.startsWith(route.path)

      // is handle without path
      if (typeof route === 'function') {
        await route({ req, res })
      } else {
        // pass some data to the request
        const { handler, ...rest } = route
        req.route = rest

        // is middleware
        if (route.isMiddleware) {
          if (pathMatches) {
            const next = (err?: any) => {} // console.log('FROM NEXT', err)
            const handle = (route.handler as ExpressHandler)(req, res, next)
            if (isPromise(handle))
              try {
                await handle
              } catch (err) {
                return next(err)
              }
          }
        }
        // is route
        else if (pathIsExact || pathIsRegex) {
          // get all regex capture groups and pass them as params to req.params
          if (pathIsRegex) {
            //const array = [...req.url.matchAll(route.path as RegExp)]
            const matches = req.url.matchAll(route.path as RegExp)
            for (const match of matches) {
              req.params = { ...match.groups }
            }
          }

          if (route.method === method) await (route.handler as Handler)({ req, res })
          else if (route.method === 'any') await (route.handler as Handler)({ req, res })
        }
      }
    }
  }
}

export class TinyServer {
  public router = new Router()
  private server!: Server
  /** alias for this.router.route */
  public r = this.router.route

  constructor() {}

  /**
   * Serve static files.
   * @param directory Has to be an absolute path.
   */
  static static(directory: string) {
    return (async (req, res, next) => {
      if (req.route.path instanceof RegExp) return next('Static middleware does not accept "RegExp" paths.')

      const pathName = new URL(req.url, `http://${req.headers.host}`).pathname
      const filePath = join(directory, pathName.substring(req.route.path.length))

      try {
        await res.send.file(filePath)
      } catch (err) {
        return next(err)
      }
    }) as ExpressHandler
  }

  private createServer(): Server {
    const server = createServer({ IncomingMessage: Request, ServerResponse: Response }, async (_req, _res) => {
      const req = <Request>_req
      const res = <Response>_res

      const result = (await this.router.handle(req, res)) as any

      // notfound/error
      if (!res.headersSent) {
        if (result instanceof Error) {
          res.status(500).send.text('500: Error')
        } else {
          res.status(404).send.text('404: Not Found')
        }
      }
    })
    return server
  }

  public listen(port: number): Promise<void> {
    return new Promise(resolve => {
      this.server = this.createServer()
      this.server.listen(port, () => {
        // graceful shutdown
        process.on('SIGTERM', async () => {
          console.log('Server is closing...')
          await this.close()
        })
        resolve()
      })
    })
  }

  public close(): Promise<void> {
    return new Promise(resolve => {
      this.server.close(() => {
        resolve()
      })
    })
  }
}

interface ExplorerConfig {
  dotFiles?: boolean
}
export const Explorer = (config: ExplorerConfig = {}) => {
  const { dotFiles = false } = config

  return async (req: Request, res: Response, next) => {
    const absolutePath = join(resolve(), req.url)

    const stats = await stat(absolutePath)

    if (await stats.isDirectory()) {
      let files = await readdir(absolutePath)
      if (!dotFiles) files = files.filter(f => !basename(f).startsWith('.'))

      const html = `
        <style>
          html {
            margin: 0;
            padding: 0;
          }
          body {
            font-family: 'Segoe UI', Tahoma, Geneva, Verdana, sans-serif;
            margin: 0;
            padding: 2.5% 5%;
          }
          h1 {
            margin-left: 24px;
            font-size: 26px;
          }
          ul {
            display: flex;
            flex-direction: column;
          }
          li {
            padding: 4px 0px;
          }
          a {
            color: blue;
            text-decoration: none;
          }
          a:hover {
            text-decoration: underline;
          }
        </style>
        <h1>${req.url.split('/').join(' / ')}</h1>
        <ul>
          ${files
            .map(f => {
              const url = `${req.url}/${f}`.replace(/\/+/gm, '/')
              return `<li><a href="${url}">${f}</a></li>`
            })
            .join('')}
        </ul>`

      return res.send.html(makeHtml(html))
    } else if (await stats.isFile()) {
      console.log('is file', absolutePath)
      return res.send.file(absolutePath)
    }

    next()
  }
}

/**
 * quick testing section
 */

// const logger: ExpressHandler = (req, res, next) => {
//   console.log('LOG:', req.url)
// }

// const main = async () => {
//   const s = new TinyServer()
//   s.r.use(Explorer())
//   s.r.get('/user/:user/:id/hello', async ({ req, res }) => {
//     // console.log('Params:', req.url, req.params)
//     res.send.text(`user ${req.params.user}`)
//   })
//   s.r.use('/static', TinyServer.static(join(resolve(), 'readme')))
//   s.r.use(logger)
//   s.r.get('/', ctx => {
//     return ctx.res.send.text('hello')
//   })
//   await s.listen(7000)
//   console.log('listening on http://localhost:7000/')
// }

// main()
