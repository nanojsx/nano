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

test('should render without errors', async () => {
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
})

test('should render without errors', async () => {
  const someStore = new Store({ data: 'init' }, 'someStore', 'local')

  expect(localStorage.getItem('someStore')).toBe('{"data":"init"}')

  let didCancel = false
  let newState = ''
  let prevState = ''

  class Child extends Component {
    store = someStore.use()

    didMount() {
      this.store.subscribe((_newState: any, _prevState: any) => {
        newState = _newState.data
        prevState = _prevState.data
        this.update()
      })
    }

    didUnmount() {
      this.store.cancel()
      didCancel = true
    }

    render() {
      return <div>This is the Child. Data: {this.store.state.data}</div>
    }
  }

  class App extends Component {
    willMount() {
      this.state = { renderChild: true }

      setTimeout(() => {
        someStore.setState({ data: 'modified' })
      }, 150)

      setTimeout(() => {
        this.setState({ renderChild: false }, true)
      }, 250)
    }

    render() {
      return <div>{this.state.renderChild ? <Child /> : <span>No Child Rendered.</span>}</div>
    }
  }

  const html = Nano.render(<App />, document.body)

  await wait(100)
  expect(nodeToString(html)).toBe('<body><div><div>This is the Child. Data: init</div></div></body>')

  await wait(100)
  expect(nodeToString(html)).toBe('<body><div><div>This is the Child. Data: modified</div></div></body>')

  await wait(100)
  expect(nodeToString(html)).toBe('<body><div><span>No Child Rendered.</span></div></body>')

  someStore.clear()
  expect(localStorage.getItem('someStore')).toBeNull()

  expect(didCancel).toBeTruthy()
  expect(newState).toBe('modified')
  expect(prevState).toBe('init')

  expect(spy).not.toHaveBeenCalled()
})
