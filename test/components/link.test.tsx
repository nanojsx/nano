import Nano, { Link } from '../../lib/index.js'
import { wait, mockIntersectionObserver } from '../helpers.js'
import { nodeToString, Fragment } from '../../lib/helpers.js'

const spy = jest.spyOn(global.console, 'error')

mockIntersectionObserver()

test('should render without errors', async (done) => {
  const App = () => {
    return (
      <Fragment>
        <Link prefetch href="https://geckosio.github.io/">
          Link to geckos.io
        </Link>
        <Link prefetch="visible" href="https://enable3d.io/">
          Link to enable3d.io
        </Link>
      </Fragment>
    )
  }

  const root = Nano.h('div', { id: 'root' }) as HTMLElement
  document.body.appendChild(root)

  Nano.render(<App />, document.getElementById('root'))

  await wait()
  expect(document.body.innerHTML).toBe(
    '<div id="root"><a href="https://geckosio.github.io/">Link to geckos.io</a><a href="https://enable3d.io/">Link to enable3d.io</a></div>'
  )
  expect(document.head.innerHTML).toBe(
    '<link rel="prefetch" href="https://geckosio.github.io/" as="document"><link rel="prefetch" href="https://enable3d.io/" as="document">'
  )
  expect(spy).not.toHaveBeenCalled()
  done()
})
