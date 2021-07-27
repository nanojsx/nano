import Nano, { Link } from '../../lib/index.js'
import { wait, mockIntersectionObserver } from '../helpers.js'
import { Fragment } from '../../lib/fragment.js'

const spy = jest.spyOn(global.console, 'error')

mockIntersectionObserver()

afterEach(async () => {
  // reset jsdom document
  document.body.innerHTML = ''
  document.head.innerHTML = ''
  await wait()
})

test('should render Link Component (prefetch and "visible")', async () => {
  const root = Nano.h('div', { id: 'root' }) as HTMLElement
  document.body.appendChild(root)

  const App = () => {
    return (
      <Fragment>
        <Link prefetch href="http://geckos.io/">
          Link to geckos.io
        </Link>
        <Link prefetch="visible" href="http://enable3d.io/">
          Link to enable3d.io
        </Link>
      </Fragment>
    )
  }

  Nano.render(<App />, document.getElementById('root'))

  await wait(250)
  expect(document.body.innerHTML).toBe(
    '<div id="root"><a href="http://geckos.io/">Link to geckos.io</a><a href="http://enable3d.io/">Link to enable3d.io</a></div>'
  )
  expect(document.head.innerHTML).toBe(
    '<link rel="prefetch" href="http://geckos.io/" as="document"><link rel="prefetch" href="http://enable3d.io/" as="document">'
  )
  expect(spy).not.toHaveBeenCalled()
})

test('should render Link Component ("hover" and back)', async () => {
  const root = Nano.h('div', { id: 'root' }) as HTMLElement
  document.body.appendChild(root)

  const App = () => {
    return (
      <Fragment>
        <Link
          ref={(c: any) => {
            setTimeout(() => {
              c.elements[0].dispatchEvent(new Event('mouseover')) // manually invoke mouseover (for testing)
            }, 100)
          }}
          prefetch="hover"
          href="http://geckos.io/">
          Link to geckos.io
        </Link>
        <Link back href="http://enable3d.io/">
          Link to enable3d.io
        </Link>
      </Fragment>
    )
  }

  Nano.render(<App />, document.getElementById('root'))

  await wait(250)
  expect(document.body.innerHTML).toBe(
    '<div id="root"><a href="http://geckos.io/">Link to geckos.io</a><a href="http://enable3d.io/">Link to enable3d.io</a></div>'
  )
  expect(document.head.innerHTML).toBe('<link rel="prefetch" href="http://geckos.io/" as="document">')
  expect(spy).not.toHaveBeenCalled()
})
