import { h, Helmet, renderSSR, Component } from '../../deno_lib/mod.ts'
import { assertEquals } from 'https://deno.land/std@0.115.1/testing/asserts.ts'
import { toSingleLine } from '../helpers.mjs'

Deno.test('should render without errors', async () => {
  class SVGTest extends Component {
    render() {
      return (
        <div id="some-id">
          <h2>Cool Inline SVG</h2>
          <svg width="100" height="100">
            <circle cx="50" cy="50" fill="yellow" r="40" stroke="green" stroke-width="4"></circle>
          </svg>
        </div>
      )
    }
  }
  const res = renderSSR(<SVGTest />)

  assertEquals(
    res,
    '<div id="some-id"><h2>Cool Inline SVG</h2><svg width="100" height="100"><circle cx="50" cy="50" fill="yellow" r="40" stroke="green" stroke-width="4"></circle></svg></div>'
  )
})

Deno.test('should render without errors', async () => {
  const Hello = () => {
    return (
      <h1>
        <svg width="100" height="100">
          <circle cx="50" cy="50" fill="yellow" r="40" stroke="green" stroke-width="4" />
        </svg>
        Hello Nano App!
      </h1>
    )
  }
  const res = renderSSR(<Hello />)

  assertEquals(
    res,
    toSingleLine(
      `<h1>
      <svg width="100" height="100">
      <circle cx="50" cy="50" fill="yellow" r="40" stroke="green" stroke-width="4"></circle>
      </svg>
      Hello Nano App!
      </h1>`
    )
  )
})
