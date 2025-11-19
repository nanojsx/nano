import Nano, { Component } from '../../lib/index.js'
import { wait } from './helpers.js'

const spy = jest.spyOn(global.console, 'error')

test('should render without errors', async () => {
  class Test extends Component {
    render() {
      return <p style={{ color: 'red', fontSize: 22 }}>hello world</p>
    }
  }
  const res = Nano.render(<Test />)

  await wait()
  expect(res.outerHTML).toBe('<p style="color:red;font-size:22;">hello world</p>')
  expect(spy).not.toHaveBeenCalled()
})

test('should only transform the keys, not the values (see https://github.com/nanojsx/nano/issues/156)', async () => {
  class Test extends Component {
    render() {
      return <p style={{ colorOne: '#abcdef', colorTwo: '#ABCDEF' }}>hello world</p>
    }
  }
  const res = Nano.render(<Test />)

  await wait()
  expect(res.outerHTML).toBe('<p style="color-one:#abcdef;color-two:#ABCDEF;">hello world</p>')
  expect(spy).not.toHaveBeenCalled()
})
