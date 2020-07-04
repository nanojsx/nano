import Nano, { Component } from '../lib/cjs/index.js'
import { wait, nodeToString } from './helpers.js'

const spy = jest.spyOn(global.console, 'error')

test('should render without errors', async (done) => {
  const parentElement = (
    <div id="root">
      <h1>Bye</h1>
    </div>
  )

  const Aux = (props: any) => {
    return props.children
  }

  Nano.render(
    <Aux>
      <h1>Hello</h1>
    </Aux>,
    parentElement
  )

  await wait()
  expect(nodeToString(parentElement)).toBe('<div id="root"><h1>Hello</h1></div>')
  expect(spy).not.toHaveBeenCalled()
  done()
})
