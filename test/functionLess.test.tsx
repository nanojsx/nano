import Nano, { Component } from '../lib/index.js'
import { wait, nodeToString } from './helpers.js'

const spy = jest.spyOn(global.console, 'error')

test('should render without errors', async (done) => {
  const Hello = <h1>Hello World!</h1>
  const Root = <div id="some-id">{Hello}</div>

  const res = Nano.render(Root)

  await wait()
  expect(nodeToString(res)).toBe('<div id="some-id"><h1>Hello World!</h1></div>')
  expect(spy).not.toHaveBeenCalled()
  done()
})
