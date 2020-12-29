/**
 * @jest-environment node
 */

import Nano, { Helmet, Store, Component } from '../lib/index.js'
import { renderSSR } from '../lib/ssr.js'

const spy = jest.spyOn(global.console, 'error')

test('should render without errors', async (done) => {
  const myStore = new Store({ name: 'Hulk' }, 'myStore', 'local')

  class App extends Component {
    store = myStore.use()

    willMount() {
      expect(myStore.state.name).toBe('Hulk')

      myStore.setState({ name: 'Thor' })
      expect(myStore.state.name).toBe('Thor')

      this.store.setState({ name: 'Iron Man' })
      expect(myStore.state.name).toBe('Iron Man')
    }

    render() {
      return <div>{this.store.state.name}</div>
    }
  }

  const app = renderSSR(<App />)
  const { body, head, footer } = Helmet.SSR(app)

  expect(body).toBe('<div>Iron Man</div>')

  expect(spy).not.toHaveBeenCalled()
  done()
})
