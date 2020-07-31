## State and Store

- Store is reactive, State isn't.
- You can access every State and Store from any component (functional and class).
- Store can be persisted in localStorage and sessionStorage.
- Store needs to be unsubscribed in didUnmount().

### State

```tsx
import { useState, getState, setState } from 'nano-jsx/lib/hooks/useState'

const MyComponent = () => {
  // every state needs an unique id
  const id = 'some-state'
  // You can use useState()...
  const [value, setValue] = useState(100, id)
  // ...or simply use getState() and setState().
  const value = getState(id)
  setState(id, newValue)

  return <p>{value}</p> // <p>100</p>
}

class MyComponent extends Component {
  // set a unique id if you use this component more than once across your app and it is using a state
  id = 'MyComponent'

  // this state now has the id 'MyComponent' and can be accessed by any other component using that id and the useState() hook
  state = { name: 'Doe' }

  // you could of course just add a simple property like "value", but it will not persist after re-mounting the component. If your component does never re-mount, you can safely do it.
  value = { name: 'Doe' }

  didMount() {
    // access this component's state
    console.log(this.state) // { name: 'Doe' }
    this.setState({ name: 'John Doe' }, true) // set true, if you want to trigger a re-render

    // access the state from the functional component above using its id
    const value = getState('some-state') // { number: 100 }
    setState('some-state', newValue)
  }

  render() {
    return (
      <div>
        <p>{this.store.state.name}</p>
        <p>{getState('some-state').number}</p>
      </div>
    ) // <div><p>John Doe</p><p>100</p></div>
  }
}
```

## Store

```tsx
import { Store } from 'nano-jsx/lib/store'

/**
 * Create your own Store.
 * @param defaultState Pass the initial State.
 * @param name The unique name of the Store (optional).
 * @param storage Pass 'memory', 'local' or 'session' (optional).
 */
const myStore = new Store({}, 'my-store', 'local')

const MyComponent = () => {
  // you can't subscribe to a store in a functional component, only read and write to it
  // adjusting the state here, will trigger the subscription event in class components
  myStore.state = { number: 100 }
  // or
  myStore.setState({ number: 100 })

  // access the store's state
  console.log(myStore.state) // { number: 100 }

  return <p>{this.store.state.number}</p> // <p>100</p>
}

class MyComponent extends Component {
  // use the myStore inside MyComponent
  store = myStore.use()

  didMount() {
    // subscribe to store changes
    this.store.subscribe((newState: any, prevState: any) => {
      // check if you need to update your component or not
      if (newState.name !== prevState.name) this.update()
    })
  }

  didUnmount() {
    // cancel the store subscription
    this.store.cancel()
  }

  render() {
    return <p>{this.store.state.number}</p> // <p>100</p>
  }
}
```
