/**
 * @jest-environment node
 */

import Nano, { Component, defineAsCustomElements } from '../../lib/index.js'
import { initSSR, renderSSR } from '../../lib/ssr.js'

/**
 * @description
 * Same as "customElementsMode.test.tsx" but for SSR.
 */

const spy = jest.spyOn(global.console, 'error')

initSSR()

test('should render as web components', async () => {
  class Test extends Component {
    render() {
      return <div>test</div>
    }
  }
  defineAsCustomElements(Test, 'nano-test1', [])

  const html = renderSSR(
    <div>
      <nano-test1></nano-test1>
    </div>
  )

  expect(html).toBe('<div><div>test</div></div>')
  expect(spy).not.toHaveBeenCalled()
})

test('should render with correct content', async () => {
  class Test extends Component {
    render() {
      return <div>test text</div>
    }
  }
  defineAsCustomElements(Test, 'nano-test2', [], { mode: 'open' })

  const html = renderSSR(
    <div>
      <nano-test2></nano-test2>
    </div>
  )

  expect(html).toBe('<div><div>test text</div></div>')
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

  const html = renderSSR(
    <div>
      <nano-test3 value="fuga"></nano-test3>
    </div>
  )

  expect(html).toBe('<div><div>test : fuga</div></div>')
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

  let html = renderSSR(
    <div>
      <nano-test4 value="fuga"></nano-test4>
    </div>
  )

  expect(html).toBe('<div><div>test : fuga</div></div>')
  expect(spy).not.toHaveBeenCalled()

  html = renderSSR(
    <div>
      <nano-test4 value="hoge"></nano-test4>
    </div>
  )

  expect(html).toEqual('<div><div>test : hoge</div></div>')
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

  const html = renderSSR(
    <div>
      <nano-test5></nano-test5>
    </div>
  )

  expect(html).toEqual('<div><div><div>Counter: 0</div><button>Increment</button></div></div>')
  expect(spy).not.toHaveBeenCalled()

  // button click is only available in the browser
  // comp?.shadowRoot?.querySelector('button')?.click()
  // expect(comp?.shadowRoot?.innerHTML).toEqual('<div><div><div>Counter: 1</div><button>Increment</button></div></div>')
  // expect(spy).not.toHaveBeenCalled()
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

  const html = renderSSR(
    <div>
      <nano-test6 value="1"></nano-test6>
    </div>
  )

  expect(html).toEqual('<div><div><div>Counter: 0</div><div>props: 1</div><button>Increment</button></div></div>')
  expect(spy).not.toHaveBeenCalled()

  // can't use querySelector in SRR
  // const comp = document.querySelector('nano-test6')
  // expect(comp?.shadowRoot?.innerHTML).toEqual(
  //   '<div><div><div>Counter: 0</div><div>props: 1</div><button>Increment</button></div></div>'
  // )

  // click can't be tested in SSR
  // comp?.shadowRoot?.querySelector('button')?.click()
  // expect(comp?.shadowRoot?.innerHTML).toEqual(
  //   '<div><div><div>Counter: 1</div><div>props: 1</div><button>Increment</button></div></div>'
  // )

  // can't change value in SSR
  // comp.attributes.value?.value = 2
  // expect(comp?.shadowRoot?.innerHTML).toEqual(
  //   '<div><div><div>Counter: 1</div><div>props: 2</div><button>Increment</button></div></div>'
  // )

  expect(spy).not.toHaveBeenCalled()
})

test('should render also with functional component', async () => {
  const Test = function ({ value }: { value: string }) {
    return <p>{value}</p>
  }

  defineAsCustomElements(Test, 'nano-test7', ['value'], { mode: 'open' })

  const html = renderSSR(
    <div>
      <nano-test7 value="hoge"></nano-test7>
    </div>
  )

  expect(html).toEqual('<div><p>hoge</p></div>')
  expect(spy).not.toHaveBeenCalled()

  // can't change values in SSR
  // comp.attributes.value?.value = 'bar'
  // expect(comp?.shadowRoot?.innerHTML).toEqual('<div><p>bar</p></div>')
  // expect(spy).not.toHaveBeenCalled()
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

  const html = renderSSR(
    <div>
      <nano-test8 header="nano jsx">
        <p>hoge</p>
      </nano-test8>
    </div>
  )

  expect(html).toEqual('<div><div><header>nano jsx</header><main><p>hoge</p></main></div></div>')
  expect(spy).not.toHaveBeenCalled()
})
