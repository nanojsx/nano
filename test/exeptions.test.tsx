import Nano, { Component, Fragment } from '../lib/index.js'
import { wait, nodeToString } from './helpers.js'

const spy = jest.spyOn(global.console, 'error')

afterEach(async () => {
  // reset jsdom document
  document.body.innerHTML = ''
  document.head.innerHTML = ''
  await wait()
})

test('should render without errors', async () => {
  const Test = () => {
    const Text2 = 1 === 1 ? null : <div></div>
    const Text3 = 1 === 1 ? null : <div></div>

    return (
      <div>
        <p>text 1</p>
        <Text2 />
        {Text3}
      </div>
    )
  }

  const res = Nano.render(<Test />, document.body)

  await wait()
  expect(nodeToString(res)).toBe('<body><div><p>text 1</p></div></body>')
  expect(spy).not.toHaveBeenCalled()
})

test('should render without errors', async () => {
  const Test = () => {
    const Text2 = 1 === 1 ? null : <div></div>
    const Text3 = 1 === 1 ? null : <div></div>

    return (
      <Fragment>
        <p>text 1</p>
        <Text2 />
        {Text3}
      </Fragment>
    )
  }

  const res = Nano.render(<Test />, document.body)

  await wait()
  expect(nodeToString(res)).toBe('<body><p>text 1</p></body>')
  expect(spy).not.toHaveBeenCalled()
})

test('should render without errors', async () => {
  const Test = () => {
    const Text2 = <p>text 2</p>
    const Text3 = <p>text 3</p>

    return (
      <div>
        <p>text 1</p>
        <Text2 />
        {Text3}
      </div>
    )
  }

  const res = Nano.render(<Test />, document.body)

  await wait()
  expect(nodeToString(res)).toBe('<body><div><p>text 1</p><p>text 2</p><p>text 3</p></div></body>')
  expect(spy).not.toHaveBeenCalled()
})

test('should render without errors', async () => {
  const Test = () => {
    const Text2 = <p>text 2</p>
    const Text3 = <p>text 3</p>

    return (
      <Fragment>
        <p>text 1</p>
        <Text2 />
        {Text3}
      </Fragment>
    )
  }

  const res = Nano.render(<Test />, document.body)

  await wait()
  expect(nodeToString(res)).toBe('<body><p>text 1</p><p>text 2</p><p>text 3</p></body>')
  expect(spy).not.toHaveBeenCalled()
})
