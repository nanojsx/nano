import Nano, { Component } from '../../lib/index.js'
import { wait, nodeToString } from './helpers.js'

const spy = jest.spyOn(global.console, 'error')

test('should render className as class', async () => {
  class Test extends Component {
    render() {
      return (
        <div id="wrapper">
          <h1 class="title">Title</h1>
          <p className="text">Text</p>
        </div>
      )
    }
  }
  const res = Nano.render(<Test />)

  await wait()
  expect(nodeToString(res)).toBe('<div id="wrapper"><h1 class="title">Title</h1><p class="text">Text</p></div>')
  expect(spy).not.toHaveBeenCalled()
})
