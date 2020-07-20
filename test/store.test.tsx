import Nano, { Component, Store } from '../lib/index.js'
import { wait, nodeToString } from './helpers.js'

const spy = jest.spyOn(global.console, 'error')

const root = document.createElement('div')
root.id = 'root'
document.body.appendChild(root)

const myStore = new Store({ name: 'Hulk' })

test('myStore should contain name: Hulk', () => {
  expect(myStore.state.name).toBe('Hulk')
})

test('name should change to Thor', () => {
  myStore.state = { name: 'Thor' }
  expect(myStore.state.name).toBe('Thor')
})

test('should render without errors', async (done) => {
  class Hero extends Component {
    store = myStore.use()

    didMount() {
      this.store.subscribe((newState: any, prevState: any) => {
        if (newState.name !== prevState.name) this.update()
      })

      setTimeout(() => {
        this.store.setState({ name: 'Iron Man' })
      }, 250)
    }

    didUnmount() {
      this.store.cancel()
    }

    render() {
      return <p>Name: {this.store.state.name}</p>
    }
  }

  const res = Nano.render(<Hero />, document.getElementById('root'))

  await wait()
  expect(nodeToString(res)).toBe('<div id="root"><p>Name: Thor</p></div>')

  await wait(500)
  expect(nodeToString(res)).toBe('<div id="root"><p>Name: Iron Man</p></div>')

  expect(spy).not.toHaveBeenCalled()
  done()
})
