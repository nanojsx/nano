import Nano, { Component } from '../../lib/index.js'
import { wait, nodeToString } from './helpers.js'

const spy = jest.spyOn(global.console, 'error')

test('should render without errors', async () => {
  const Hello = (props: any) => <p>Hello {props.name}</p>

  const hello = Nano.render(<Hello name="John" />)

  const Root = () => <div id="root">{hello}</div>

  const root = Nano.render(<Root />)

  await wait()
  expect(nodeToString(root)).toBe('<div id="root"><p>Hello John</p></div>')
  expect(spy).not.toHaveBeenCalled()
})
