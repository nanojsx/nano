import { createServer, IncomingMessage, Server, ServerResponse } from 'http'
import { readFile } from 'fs/promises'
import { extname, isAbsolute, join, resolve } from 'path'

const mime = (fileName: string) => {
  switch (extname(fileName)) {
    case '.js':
      return 'application/javascript'
    case '.html':
      return 'text/html'
    default:
      return 'text/plain'
  }
}

export class Request extends IncomingMessage {}

export class Response extends ServerResponse {
  public get send() {
    return {
      status: (statusCode: number) => {
        this.statusCode = statusCode
        return this.send
      },
      file: async (path: string) => {
        const absolutePath = isAbsolute(path)
          ? path
          : join(resolve(), ...path.split('/').filter(p => p && p.length > 0))

        const file = await readFile(absolutePath, { encoding: 'utf-8' })
        this.writeHead(200, { 'Content-Type': mime(absolutePath) })
        this.end(file)
      },
      text: (text: string) => {
        this.writeHead(this.statusCode || 200, { 'Content-Type': 'text/plain' })
        this.end(text)
      }
    }
  }
}

export type Context = {
  req: Request
  res: Response
}

export interface handler {
  (ctx: Context): void
}

export interface Routes {
  [key: string]: handler
}

export class Router {
  constructor(public routes: Routes) {}

  async handle(req: Request, res: Response) {
    for (const [key, value] of Object.entries(this.routes)) {
      if (key === req.url) {
        await value({ req, res })
      }
    }
  }
}

export class TinyServer {
  private router: Router
  private server!: Server

  constructor(routes: Routes) {
    this.router = new Router(routes)
  }

  private createServer(): Server {
    const server = createServer({ IncomingMessage: Request, ServerResponse: Response }, async (req, res) => {
      await this.router.handle(req as Request, res as Response)

      // 404 page
      if (!res.headersSent) {
        ;(res as Response).send.status(404).text('404: Not Found')
      }
    })
    return server
  }

  public listen(port: number): Promise<void> {
    return new Promise(resolve => {
      this.server = this.createServer()
      this.server.listen(port, () => {
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
