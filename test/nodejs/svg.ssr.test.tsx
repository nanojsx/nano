/**
 * @jest-environment node
 */

import Nano, { renderSSR, Component } from '../../lib/index.js'

test('should render without errors', async () => {
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
  const res = renderSSR(<SVGTest />)

  expect(res).toBe(
    '<div id="some-id"><h2>Cool Inline SVG</h2><svg height="100" width="100"><circle cx="50" cy="50" r="40" stroke="green" stroke-width="4" fill="yellow"></circle></svg></div>'
  )
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

  const res = renderSSR(<Hello />)

  expect(res).toBe(
    '<h1><svg height="100" width="100"><circle cx="50" cy="50" fill="yellow" r="40" stroke="green" stroke-width="4"></circle></svg>Hello Nano App!</h1>'
  )
})
