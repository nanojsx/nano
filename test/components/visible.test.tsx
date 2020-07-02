import Nano, { Visible } from '../../lib/index.js'
import { wait, mockIntersectionObserver } from '../helpers.js'
import { nodeToString } from '../../lib/helpers.js'

const spy = jest.spyOn(global.console, 'error')

mockIntersectionObserver()

test('should render without errors', async (done) => {
  const App = () => {
    return (
      <Visible>
        <div id="comment-section">
          <h2>Comment Section</h2>
          <p>Comment 1</p>
          <p>Comment 2</p>
        </div>
      </Visible>
    )
  }

  const root = Nano.h('div', { id: 'root' }) as HTMLElement
  document.body.appendChild(root)

  Nano.render(<App />, document.getElementById('root'))
  expect(document.body.innerHTML).toBe('<div id="root"><div id="comment-section" visibility="hidden"></div></div>')

  await wait()
  expect(document.body.innerHTML).toBe(
    '<div id="root"><div id="comment-section"><div id="comment-section"><h2>Comment Section</h2><p>Comment 1</p><p>Comment 2</p></div></div></div>'
  )
  expect(spy).not.toHaveBeenCalled()
  done()
})
