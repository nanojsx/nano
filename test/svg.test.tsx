import Nano, { Component } from '../lib/cjs/index.js'
import { wait, nodeToString } from './helpers.js'

const spy = jest.spyOn(global.console, 'error')

test('should render without errors', async (done) => {
  class SVGTest extends Component {
    render() {
      return (
        <div id="some-id">
          <h2>Cool Inline SVG</h2>
          <svg height="100" width="100">
            <circle cx="50" cy="50" r="40" stroke="green" stroke-width="4" fill="yellow"></circle>
          </svg>
        </div>
      )
    }
  }
  const res = Nano.render(<SVGTest />)

  await wait()
  expect(nodeToString(res)).toBe(
    '<div id="some-id"><h2>Cool Inline SVG</h2><svg width="100" height="100"><circle cx="50" cy="50" r="40" stroke="green" stroke-width="4" fill="yellow"></circle></svg></div>'
  )
  expect(spy).not.toHaveBeenCalled()
  done()
})
