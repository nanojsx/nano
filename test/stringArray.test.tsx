import Nano, { Component, Fragment } from '../lib/index.js'
import { wait, nodeToString } from './helpers.js'

const spy = jest.spyOn(global.console, 'error')

test('should render without errors', async (done) => {
  const Hello = (props: any) => (
    <p>
      Hello {props.name} {props.age} null {null} {{}} {[]} {undefined} {'Some String'} 'Another String'
    </p>
  )

  const res = Nano.render(<Hello name="John" />)

  await wait()
  expect(nodeToString(res)).toBe("<p>Hello John  null     Some String 'Another String'</p>")
  expect(spy).not.toHaveBeenCalled()
  done()
})

test('should render without errors', async (done) => {
  const Hello = (props: any) => <p>Hello String</p>

  const res = Nano.render(<Hello name="John" />)

  await wait()
  expect(nodeToString(res)).toBe('<p>Hello String</p>')
  expect(spy).not.toHaveBeenCalled()
  done()
})
