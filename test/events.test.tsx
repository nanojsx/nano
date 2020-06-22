import Nano, { Component } from '../lib/index.js'
import { wait } from './helpers.js'

const spy = jest.spyOn(global.console, 'error')

test('should render without errors', async (done) => {
  const Root = () => (
    <button
      onClick={() => {
        console.log('click')
      }}
    >
      click me
    </button>
  )

  Nano.render(<Root />)

  await wait()
  expect(spy).not.toHaveBeenCalled()
  done()
})
