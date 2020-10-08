import Nano, { Component } from '../lib/index.js'
import { wait } from './helpers.js'

const spy = jest.spyOn(global.console, 'error')

test('should render without errors', async (done) => {
  class Bli extends Component {
    render() {
      // do something
      return
    }
  }
  class Bla extends Component {
    render() {
      // do something
    }
  }

  const Blu = () => {
    // do something
    return
  }

  class App extends Component {
    render() {
      return (
        <div>
          My App
          <p>
            <Bli />
            <Bla />
            <Blu />
          </p>
        </div>
      )
    }
  }

  const res = Nano.render(<App />)

  await wait()
  expect(res.outerHTML).toBe('<div>My App<p></p></div>')
  expect(spy).not.toHaveBeenCalled()
  done()
})
