import Nano, { Component, FC } from '../lib/index.js'
import { wait, nodeToString } from './helpers.js'
import { Suspense } from '../lib/components/suspense.js'

const spy = jest.spyOn(global.console, 'error')

test('should render without errors', async (done) => {
  const fetchComments = (): Promise<string[]> => {
    const comments = ['comment_one', 'comment_two']

    return new Promise((resolve) => {
      setTimeout(() => {
        resolve(comments)
      }, 200)
    })
  }

  const Comments: FC<{ comments?: string[] }> = ({ comments }) => {
    return (
      <ul>
        {comments?.map((c) => (
          <li>{c}</li>
        ))}
      </ul>
    )
  }

  const Loading = () => <div>loading...</div>

  class App extends Component {
    didMount() {
      setTimeout(() => {
        this.update()
      }, 200)
    }

    static fetchComments(): any {}

    render() {
      return (
        <div>
          <h2>Comments</h2>
          <Suspense cache comments={App.fetchComments() || fetchComments} fallback={<Loading />}>
            <Comments />
          </Suspense>
        </div>
      )
    }
  }

  const html = Nano.render(<App />, document.body)

  await wait()
  expect(nodeToString(html)).toBe('<body><div><h2>Comments</h2><div>loading...</div></div></body>')

  await wait(200)
  expect(nodeToString(html)).toBe(
    '<body><div><h2>Comments</h2><ul><li>comment_one</li><li>comment_two</li></ul></div></body>'
  )

  expect(spy).not.toHaveBeenCalled()
  done()
})
