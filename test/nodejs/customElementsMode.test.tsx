import Nano, { Component, defineAsCustomElements } from '../../lib/index.js'
import { wait } from './helpers.js'

const spy = jest.spyOn(global.console, 'error')

afterEach(async () => {
  // reset jsdom document
  document.body.innerHTML = ''
  document.head.innerHTML = ''
  await wait()
})

test('should render as web components (without shadow DOM)', async () => {
  class Test extends Component {
    render() {
      return <div>test</div>
    }
  }
  defineAsCustomElements(Test, 'nano-test1', [])

  document.body.innerHTML = '<nano-test1></nano-test1>'

  await wait()
  const comp = document.querySelector('nano-test1')
  expect(comp?.outerHTML).toBe('<nano-test1><div>test</div></nano-test1>')
  expect(comp?.shadowRoot).toBeNull()
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
  expect(comp?.shadowRoot?.innerHTML).toEqual('<div>test text</div>')
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
  expect(comp?.shadowRoot?.innerHTML).toEqual('<div>test : fuga</div>')
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
  expect(comp?.shadowRoot?.innerHTML).toEqual('<div>test : fuga</div>')

  document.body.innerHTML = '<nano-test4 value="hoge"></nano-test4>'
  const compChanged = document.querySelector('nano-test4')
  expect(compChanged?.shadowRoot?.innerHTML).toEqual('<div>test : hoge</div>')
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
  expect(comp?.shadowRoot?.innerHTML).toEqual('<div><div>Counter: 0</div><button>Increment</button></div>')

  comp?.shadowRoot?.querySelector('button')?.click()
  expect(comp?.shadowRoot?.innerHTML).toEqual('<div><div>Counter: 1</div><button>Increment</button></div>')
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
    '<div><div>Counter: 0</div><div>props: 1</div><button>Increment</button></div>'
  )

  comp?.shadowRoot?.querySelector('button')?.click()
  expect(comp?.shadowRoot?.innerHTML).toEqual(
    '<div><div>Counter: 1</div><div>props: 1</div><button>Increment</button></div>'
  )
  // @ts-ignore
  comp.attributes.value?.value = 2
  expect(comp?.shadowRoot?.innerHTML).toEqual(
    '<div><div>Counter: 1</div><div>props: 2</div><button>Increment</button></div>'
  )
  expect(spy).not.toHaveBeenCalled()
})

test('should render also with functional component', async () => {
  const Test = function ({ value }: { value: string }) {
    return <p>{value}</p>
  }

  defineAsCustomElements(Test, 'nano-test7', ['value'], { mode: 'open' })

  document.body.innerHTML = '<nano-test7 value="hoge"></nano-test7>'

  await wait()

  const comp = document.querySelector('nano-test7')
  expect(comp?.shadowRoot?.innerHTML).toEqual('<p>hoge</p>')
  // @ts-ignore
  comp.attributes.value?.value = 'bar'
  expect(comp?.shadowRoot?.innerHTML).toEqual('<p>bar</p>')
  expect(spy).not.toHaveBeenCalled()
})

test('should render also with slot', async () => {
  class Test extends Component {
    header: string
    children: any

    constructor(props: { header: string; children: any }) {
      super(props)
      this.header = props.header
      this.children = props.children
    }

    render() {
      return (
        <div>
          <header>{this.header}</header>
          <main>{this.children}</main>
        </div>
      )
    }
  }

  defineAsCustomElements(Test, 'nano-test8', ['header'], { mode: 'open' })

  document.body.innerHTML = '<nano-test8 header="nano jsx"><p>hoge</p></nano-test8>'

  await wait()

  const comp = document.querySelector('nano-test8')
  expect(comp?.shadowRoot?.innerHTML).toEqual('<div><header>nano jsx</header><main><p>hoge</p></main></div>')
  expect(spy).not.toHaveBeenCalled()
})
