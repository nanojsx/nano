import Nano, { Component } from '../lib/index.js'
import { wait, nodeToString } from './helpers.js'

const spy = jest.spyOn(global.console, 'error')

afterEach(async () => {
  // reset jsdom document
  document.body.innerHTML = ''
  document.head.innerHTML = ''
  await wait()
})

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
  const parent = { mount: 0, unmount: 0 }
  const child = { mount: 0, unmount: 0 }

  class Child extends Component {
    didMount() {
      child.mount++
    }

    didUnmount() {
      child.unmount++
    }

    render() {
      return <p>test</p>
    }
  }

  class Parent extends Component {
    show = true
    didMount() {
      parent.mount++

      setTimeout(() => {
        this.update()
      }, 100)

      setTimeout(() => {
        this.show = false
        this.update()
      }, 200)

      setTimeout(() => {
        this.show = true
        this.update()
      }, 300)
    }

    render() {
      return this.show ? (
        <div id="root">
          <Child />
        </div>
      ) : (
        <div id="root">empty</div>
      )
    }
  }
  const res = Nano.render(<Parent />, document.body)

  await wait(400)

  expect(parent.mount).toBe(1)
  expect(parent.unmount).toBe(0)

  expect(child.mount).toBe(3)
  expect(child.unmount).toBe(2)

  expect(spy).not.toHaveBeenCalled()
  done()
})

test('should render without errors', async (done) => {
  class Test extends Component {
    test() {
      return 'yeah'
    }
  }
  const test = new Test({ children: [] }, 'some-unique-hash')

  await wait()
  // @ts-ignore
  expect(test.render()).toBe(undefined)
  // @ts-ignore
  expect(() => test.update()).toThrow()
  expect(test.test()).toBe('yeah')
  expect(spy).not.toHaveBeenCalled()
  done()
})
