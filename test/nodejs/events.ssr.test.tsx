/**
 * @jest-environment node
 */

import Nano from '../../lib/index.js'

const spy = jest.spyOn(global.console, 'error')

test('should remove events in SSR', async () => {
  const App = () => {
    const handle = () => {
      console.log('hello')
    }
    return (
      <button onClick={handle} class="hello world">
        Click
      </button>
    )
  }

  const html = Nano.renderSSR(<App />)

  expect(html).toBe('<button class="hello world">Click</button>')
  expect(spy).not.toHaveBeenCalled()
})
