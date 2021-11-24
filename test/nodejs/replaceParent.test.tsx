import Nano, { Component } from '../../lib/index.js'
import { wait, nodeToString } from './helpers.js'

const spy = jest.spyOn(global.console, 'error')

test('should render without errors', async () => {
  const root = document.createElement('div')
  root.id = 'root'
  const feature = document.createElement('div')
  feature.id = 'feature'
  root.appendChild(feature)

  class Test extends Component {
    render() {
      // will replace the parent which has the same id (feature)
      return (
        <div id="feature">
          <p>content</p>
        </div>
      )
    }
  }
  const res = Nano.render(<Test />, feature)

  await wait()
  expect(root.outerHTML).toBe('<div id="root"><div id="feature"><p>content</p></div></div>')
  expect(spy).not.toHaveBeenCalled()
})
