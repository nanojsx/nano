import Nano, { Component } from '../../lib/index.js'
import { wait, nodeToString } from './helpers.js'

const spy = jest.spyOn(global.console, 'error')

test('should render without errors', async () => {
  class SVGTest extends Component {
    render() {
      return (
        <div id="some-id">
          <h2>Cool Inline SVG</h2>
          <svg height="100" width="100">
            <circle cx="50" cy="50" fill="yellow" r="40" stroke="green" stroke-width="4"></circle>
          </svg>
        </div>
      )
    }
  }
  const res = Nano.render(<SVGTest />)

  await wait()
  expect(nodeToString(res)).toBe(
    '<div id="some-id"><h2>Cool Inline SVG</h2><svg width="100" height="100"><circle cx="50" cy="50" fill="yellow" r="40" stroke="green" stroke-width="4"></circle></svg></div>'
  )
  expect(spy).not.toHaveBeenCalled()
})

test('should render without errors', async () => {
  const Hello = () => {
    return (
      <h1>
        <svg height="100" width="100">
          <circle cx="50" cy="50" fill="yellow" r="40" stroke="green" stroke-width="4" />
        </svg>
        Hello Nano App!
      </h1>
    )
  }

  const res = Nano.render(<Hello />)

  await wait()
  expect(nodeToString(res)).toBe(
    '<h1><svg width="100" height="100"><circle cx="50" cy="50" fill="yellow" r="40" stroke="green" stroke-width="4"></circle></svg>Hello Nano App!</h1>'
  )
  expect(spy).not.toHaveBeenCalled()
})
