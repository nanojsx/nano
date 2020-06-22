import Nano, { Component } from '../lib/index.js'
import { wait } from './helpers.js'

const spy = jest.spyOn(global.console, 'error')

test('should render without errors', async (done) => {
  class Test extends Component {
    ready = false
    didMount() {
      this.ready = true
      this.update()
    }
    render() {
      const text = this.ready ? 'ready' : 'waiting'
      return <p>{text}</p>
    }
  }
  const Root = () => (
    <div>
      <Test />
    </div>
  )

  const res = Nano.render(<Root />)

  await wait()
  expect(res.outerHTML).toBe('<div><p>ready</p></div>')
  expect(spy).not.toHaveBeenCalled()
  done()
})
