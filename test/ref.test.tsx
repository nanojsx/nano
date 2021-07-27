import { FC } from '../lib/core.js'
import Nano, { Component, Fragment } from '../lib/index.js'
import { wait, nodeToString } from './helpers.js'

const spy = jest.spyOn(global.console, 'error')

test('should render without errors', async () => {
  const Child: FC<{ getReference: (el: HTMLElement) => void }> = ({ getReference }) => {
    return <div ref={(r: any) => getReference(r)}>I'm a child</div>
  }

  class App extends Component {
    child: HTMLElement | undefined

    didMount() {
      const child = this.child?.cloneNode(true)
      this.update(child)
    }

    render(child: any) {
      return (
        <Fragment>
          <h1>App</h1>
          <Child getReference={ref => (this.child = ref)} />
          {child}
        </Fragment>
      )
    }
  }

  let html = Nano.render(
    <div>
      <App />
    </div>
  )

  await wait()
  expect(nodeToString(html)).toBe(`<div><h1>App</h1><div>I'm a child</div><div>I'm a child</div></div>`)
  expect(spy).not.toHaveBeenCalled()
})

test('should render without errors', async () => {
  let ref1: string = ''
  let ref2: string = ''

  class Test extends Component {
    render() {
      return (
        <div
          ref={(node: HTMLDivElement) => {
            ref1 = nodeToString(node)
          }}>
          <p
            id="text-id"
            ref={(node: HTMLParagraphElement) => {
              ref2 = nodeToString(node)
            }}>
            some text
          </p>
        </div>
      )
    }
  }

  const Root = () => (
    <div id="root">
      <h1>I am the heading</h1>
      <Test />
    </div>
  )

  Nano.render(<Root />)

  await wait()
  expect(ref1).toBe('<div><p id="text-id">some text</p></div>')
  expect(ref2).toBe('<p id="text-id">some text</p>')
  expect(spy).not.toHaveBeenCalled()
})
