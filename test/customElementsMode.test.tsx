import Nano, { Component, defineAsCustomElements } from '../lib/index.js'
import { wait } from './helpers.js'

const spy = jest.spyOn(global.console, 'error')

afterEach(async () => {
  // reset jsdom document
  document.body.innerHTML = ''
  document.head.innerHTML = ''
  await wait()
})

test('should render as web components', async () => {
  class Test extends Component {
    render() {
      return <div>test</div>
    }
  }
  defineAsCustomElements(Test, 'nano-test1', [])

  document.body.innerHTML = '<nano-test1></nano-test1>'

  await wait()
  expect(document.body.outerHTML).toBe('<body><nano-test1></nano-test1></body>')
  expect(spy).not.toHaveBeenCalled()
})

test('should render with correct content', async () => {
  class Test extends Component {
    render() {
      return <div>test text</div>
    }
  }
  defineAsCustomElements(Test, 'nano-test2', [], { mode: 'open' })

  document.body.innerHTML = '<nano-test2></nano-test2>'

  await wait()

  const comp = document.querySelector('nano-test2')
  expect(comp?.shadowRoot?.innerHTML).toEqual('<div><div>test text</div></div>')
  expect(spy).not.toHaveBeenCalled()
})

test('should render with props', async () => {
  class Test extends Component {
    value: string

    constructor(props: { value: string }) {
      super(props)

      this.value = props.value
    }

    render() {
      return <div>test : {this.value}</div>
    }
  }
  defineAsCustomElements(Test, 'nano-test3', ['value'], { mode: 'open' })

  document.body.innerHTML = '<nano-test3 value="fuga"></nano-test3>'

  await wait()

  const comp = document.querySelector('nano-test3')
  expect(comp?.shadowRoot?.innerHTML).toEqual('<div><div>test : fuga</div></div>')
  expect(spy).not.toHaveBeenCalled()
})

test('should update render result with props change', async () => {
  class Test extends Component {
    value: string

    constructor(props: { value: string }) {
      super(props)

      this.value = props.value
    }

    render() {
      return <div>test : {this.value}</div>
    }
  }
  defineAsCustomElements(Test, 'nano-test4', ['value'], { mode: 'open' })

  document.body.innerHTML = '<nano-test4 value="fuga"></nano-test4>'

  await wait()

  const comp = document.querySelector('nano-test4')
  expect(comp?.shadowRoot?.innerHTML).toEqual('<div><div>test : fuga</div></div>')

  document.body.innerHTML = '<nano-test4 value="hoge"></nano-test4>'
  const compChanged = document.querySelector('nano-test4')
  expect(compChanged?.shadowRoot?.innerHTML).toEqual('<div><div>test : hoge</div></div>')
  expect(spy).not.toHaveBeenCalled()
})

test('should change render result with state change', async () => {
  class Test extends Component {
    value: number = 0

    changeValue(newValue: number) {
      this.value += newValue
      this.update()
    }

    render() {
      return (
        <div>
          <div>Counter: {this.value}</div>
          <button onClick={() => this.changeValue(1)}>Increment</button>
        </div>
      )
    }
  }
  defineAsCustomElements(Test, 'nano-test5', [], { mode: 'open' })

  document.body.innerHTML = '<nano-test5></nano-test5>'

  await wait()

  const comp = document.querySelector('nano-test5')
  expect(comp?.shadowRoot?.innerHTML).toEqual('<div><div><div>Counter: 0</div><button>Increment</button></div></div>')

  comp?.shadowRoot?.querySelector('button')?.click()
  expect(comp?.shadowRoot?.innerHTML).toEqual('<div><div><div>Counter: 1</div><button>Increment</button></div></div>')
  expect(spy).not.toHaveBeenCalled()
})

test('should keep state with props change', async () => {
  class Test extends Component {
    stateValue: number = 0
    value: number

    constructor(props: { value: number }) {
      super(props)
      this.value = props.value
    }

    changeValue(newValue: number) {
      this.stateValue += newValue
      this.update()
    }

    render() {
      return (
        <div>
          <div>Counter: {this.stateValue}</div>
          <div>props: {this.value}</div>
          <button onClick={() => this.changeValue(1)}>Increment</button>
        </div>
      )
    }
  }
  defineAsCustomElements(Test, 'nano-test6', ['value'], { mode: 'open' })

  document.body.innerHTML = '<nano-test6 value="1"></nano-test6>'

  await wait()

  const comp = document.querySelector('nano-test6')
  expect(comp?.shadowRoot?.innerHTML).toEqual(
    '<div><div><div>Counter: 0</div><div>props: 1</div><button>Increment</button></div></div>'
  )

  comp?.shadowRoot?.querySelector('button')?.click()
  expect(comp?.shadowRoot?.innerHTML).toEqual(
    '<div><div><div>Counter: 1</div><div>props: 1</div><button>Increment</button></div></div>'
  )
  // @ts-ignore
  comp.attributes.value?.value = 2
  expect(comp?.shadowRoot?.innerHTML).toEqual(
    '<div><div><div>Counter: 1</div><div>props: 2</div><button>Increment</button></div></div>'
  )
  expect(spy).not.toHaveBeenCalled()
})
