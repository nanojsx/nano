// @deno-types="./typings/global.d.ts"
import { h, Helmet, renderSSR, Component } from './deno_lib/mod.ts'
import { assertEquals } from 'https://deno.land/std@0.93.0/testing/asserts.ts'

Deno.test('should render without errors', () => {
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
        <meta name="description" content="Nano JSX App" />
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

  assertEquals(
    body,
    '<div><h2>Comments</h2><div id="comments"><ul><li>Comment One</li><li>Comment Two</li></ul></div></div>'
  )
  assertEquals(head.join('\n'), '<title>Nano JSX SSR</title><meta content="Nano JSX App" name="description" />')
  assertEquals(footer.join('\n'), '<script src="/bundle.js"></script>')
})
