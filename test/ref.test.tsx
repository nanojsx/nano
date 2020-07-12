import Nano, { Component } from '../lib/index.js'
import { wait, nodeToString } from './helpers.js'

const spy = jest.spyOn(global.console, 'error')

test('should render without errors', async (done) => {
  let ref1: string = ''
  let ref2: string = ''

  class Test extends Component {
    render() {
      return (
        <div
          ref={(node: HTMLDivElement) => {
            ref1 = nodeToString(node)
          }}
        >
          <p
            id="text-id"
            ref={(node: HTMLParagraphElement) => {
              ref2 = nodeToString(node)
            }}
          >
            some text
          </p>
        </div>
      )
    }
  }

  const Root = () => (
    <div id="root">
      <h1>I am the heading</h1>
      <Test />
    </div>
  )

  Nano.render(<Root />)

  await wait()
  expect(ref1).toBe('<div><p id="text-id">some text</p></div>')
  expect(ref2).toBe('<p id="text-id">some text</p>')
  expect(spy).not.toHaveBeenCalled()
  done()
})
