import Nano from '../lib/index.js'
import { jsx } from '../lib/jsx-runtime/index.js'
import { wait, nodeToString } from './helpers.js'

const spy = jest.spyOn(global.console, 'error')

test('should render without errors', async () => {
  const Root = () => {
    return jsx(
      'div',
      {
        id: 'root',
        children: [
          jsx(
            'h1',
            {
              children: ['Hello']
            },
            'bar'
          )
        ]
      },
      'hoge'
    )
  }

  const res = Nano.render(Root)

  await wait()
  expect(nodeToString(res)).toBe('<div id="root"><h1>Hello</h1></div>')
  expect(spy).not.toHaveBeenCalled()
})
