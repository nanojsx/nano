import Nano, { Component } from '../lib/index.js'
import { wait, nodeToString } from './helpers.js'

const spy = jest.spyOn(global.console, 'error')

afterEach(async () => {
  // reset jsdom document
  document.body.innerHTML = ''
  document.head.innerHTML = ''
  await wait()
})

test('should render without errors', async () => {
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
})

test('should render without errors', async () => {
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
})

test('should render without errors', async () => {
  class Test extends Component {
    test() {
      return 'yeah'
    }
  }
  // @ts-expect-error // otherwise it does not work
  Test.prototype._getHash = () => ''

  const test = new Test({ children: [] })

  await wait()
  // @ts-ignore
  expect(test.render()).toBe(undefined)
  // @ts-ignore
  expect(() => test.update()).toThrow()
  expect(test.test()).toBe('yeah')
  expect(spy).not.toHaveBeenCalled()
})

test('should render without errors', async () => {
  interface TestProps {
    index: number
  }
  class Test extends Component<TestProps> {
    constructor(props: TestProps) {
      super(props)
      this.id = this.props.index.toString()
      this.state = { number: this.props.index }
    }

    didMount() {
      setTimeout(() => {
        this.state = { ...this.state, number: (this.state.number += 0.1) }
        this.update()
      }, Math.random() * 1000 + 200)
    }

    render() {
      return <p>{this.state.number}</p>
    }
  }

  class App extends Component {
    tests = new Array(5).fill(undefined).map((val, idx) => idx)

    render() {
      return (
        <div>
          {this.tests.map(t => {
            return <Test index={t} />
          })}
        </div>
      )
    }
  }

  const res = Nano.render(<App />, document.body)

  await wait()
  expect(res.innerHTML).toBe('<div><p>0</p><p>1</p><p>2</p><p>3</p><p>4</p></div>')

  await wait(1500)
  expect(res.innerHTML).toBe('<div><p>0.1</p><p>1.1</p><p>2.1</p><p>3.1</p><p>4.1</p></div>')

  expect(spy).not.toHaveBeenCalled()
})
