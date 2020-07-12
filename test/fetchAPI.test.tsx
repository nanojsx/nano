import Nano, { Component } from '../lib/index.js'
import { nodeToString, wait } from './helpers.js'

const spy = jest.spyOn(global.console, 'error')

test('should render without errors', async (done) => {
  // mock fetch api
  const fetchMock = (_url: string) => {
    return new Promise((resolve) => {
      setTimeout(() => {
        resolve({ data: [{ name: 'John' }, { name: 'Suzanne' }] })
      }, 1000)
    })
  }

  // the dom
  const parentElement = <div id="root"></div>

  // store all promises
  const promises: Promise<any>[] = []

  class Names extends Component {
    data: any
    promise: any

    willMount() {
      // keep track of all promises
      this.promise = fetchMock('/api/names')
      promises.push(this.promise)
    }

    async didMount() {
      const res = (await this.promise) as any

      if (res) {
        this.data = res.data
        this.update()
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

  // wait for all promises to be resolved
  await Promise.all(promises)

  expect(nodeToString(res)).toBe('<div id="root"><ul><li>John</li><li>Suzanne</li></ul></div>')
  expect(spy).not.toHaveBeenCalled()
  done()
})
