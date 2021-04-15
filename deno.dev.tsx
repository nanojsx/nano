// @deno-types="./typings/global.d.ts"
import { h, Helmet, renderSSR, Component } from './deno_lib/mod.ts'
import { Application, Router } from 'https://deno.land/x/oak@v7.0.0/mod.ts'

const comments = ['Comment One', 'Comment Two']

class Comments extends Component {
  render() {
    return (
      <ul>
        {this.props.comments.map((comment: any) => {
          return <li>{comment}</li>
        })}
      </ul>
    )
  }
}

const App = () => (
  <div>
    <Helmet>
      <title>Nano JSX SSR</title>
      <meta name="description" content="Server Side Rendered Nano JSX Application" />
    </Helmet>

    <Helmet footer>
      <script src="/bundle.js"></script>
    </Helmet>

    <h2>Comments</h2>
    <div id="comments">
      <Comments comments={comments} />
    </div>
  </div>
)

const ssr = renderSSR(<App />)
const { body, head, footer } = Helmet.SSR(ssr)

console.log(body)

const html = `
<!DOCTYPE html>
<html lang="en">
  <head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    ${head.join('\n')}
  </head>
  <body>
    ${body}
    ${footer.join('\n')}
  </body>
</html>`

const router = new Router()
router.get('/', context => {
  context.response.body = html
})

const app = new Application()
app.use(router.routes())
app.use(router.allowedMethods())

app.addEventListener('listen', ({ hostname, port, secure }) => {
  console.log(`Listening on: ${secure ? 'https://' : 'http://'}${hostname ?? 'localhost'}:${port}`)
})

await app.listen({ port: 5000 })
