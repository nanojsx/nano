import Nano, { Component } from '../lib/index.js'
import { nodeToString, wait } from './helpers.js'

const spy = jest.spyOn(global.console, 'error')

test('should render without errors', async (done) => {
  const fetchMock = (_url: string) => {
    return new Promise((resolve) => {
      setTimeout(() => {
        resolve({ data: [{ name: 'John' }, { name: 'Suzanne' }] })
      }, 100)
    })
  }

  const parentElement = <div id="root"></div>

  class Names extends Component {
    data: any

    async didMount() {
      const res: any = await fetchMock('/api/names')
      if (res) {
        this.data = res.data
        this.update()
        // emit a custom event to the parent node
        const event = new CustomEvent('dataLoaded')
        parentElement.dispatchEvent(event)
      }
    }

    render() {
      if (this.data) {
        return (
          <ul>
            {this.data.map((d: any) => {
              return <li>{d.name}</li>
            })}
          </ul>
        )
      } else {
        return <div>...loading</div>
      }
    }
  }

  // NOTE: The component "Names" needs at least one parent to be able to update.
  const res = Nano.render(<Names />, parentElement)

  parentElement.addEventListener('dataLoaded', () => {
    expect(nodeToString(res)).toBe('<div id="root"><ul><li>John</li><li>Suzanne</li></ul></div>')
    expect(spy).not.toHaveBeenCalled()
    done()
  })
})
