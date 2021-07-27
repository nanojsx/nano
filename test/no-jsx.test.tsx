import Nano, { Component, h } from '../lib/index.js'
import { wait } from './helpers.js'

const spy = jest.spyOn(global.console, 'error')

test('should render without errors', async () => {
  // we put this in, just to test it as well
  const ListElement = () => <li>even more text</li>

  class Test extends Component {
    // @ts-ignore
    render() {
      const listElement1 = h('li', { class: 'test' }, 'some text')
      const listElement2 = h('li', null, 'more text')
      const list = h('ul', { id: 'list' }, [listElement1, listElement2, <ListElement />])
      const header = h('h1', null)
      const div = h('div', null, list, header)

      return div
    }
  }

  const res = Nano.render(<Test />)

  await wait()
  expect(res.outerHTML).toBe(
    '<div><ul id="list"><li class="test">some text</li><li>more text</li><li>even more text</li></ul><h1></h1></div>'
  )
  expect(spy).not.toHaveBeenCalled()
})
