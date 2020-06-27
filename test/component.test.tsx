import Nano, { Component } from '../lib/index.js'
import { wait } from './helpers.js'

const spy = jest.spyOn(global.console, 'error')

test('should render without errors', async (done) => {
  const rootElement = <div id="root"></div>

  class Test extends Component {
    render() {
      return <div>test</div>
    }
  }
  const res = Nano.render(<Test />, rootElement)

  await wait()
  expect(rootElement.outerHTML).toBe('<div id="root"><div>test</div></div>')
  expect(spy).not.toHaveBeenCalled()
  done()
})

test('should render without errors', async (done) => {
  class Test extends Component {
    test() {
      return <span>yeah</span>
    }
  }
  const test = new Test()

  await wait()
  // @ts-ignore
  expect(test.render()).toBe(undefined)
  // @ts-ignore
  expect(test.update()).toBe('<div>[NOTHING TO RENDER]</div>')
  expect(test.test()).toBe('yeah')
  expect(spy).toHaveBeenCalled()
  done()
})
