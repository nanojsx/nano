import Nano, { Component, nodeToString } from '../../lib/index.js'
import { wait } from '../helpers.js'
import { getState, setState, useState } from '../../lib/hooks/useState'
import { setTimeout } from 'timers'

const spy = jest.spyOn(global.console, 'error')

test('should render without errors', async (done) => {
  let _value0 = ''
  let _value1 = ''

  const Child = () => {
    // add some random state
    const [random, setRandom] = useState('random', 'Child_Component')

    // access the state of App_Component
    const [value, setValue] = useState(null, 'App_Component')
    _value0 = value

    const newValue = 'new state'
    setValue('new state')

    return <div>{newValue}</div>
  }

  class App extends Component {
    willMount() {
      this.id = 'App_Component'
      this.setState('initial state')

      setTimeout(() => {
        _value1 = this.state
      }, 150)
    }

    render() {
      return (
        <div>
          <Child />
        </div>
      )
    }
  }
  const html = Nano.render(<App />)

  await wait(100)
  expect(nodeToString(html)).toBe('<div><div>new state</div></div>')

  await wait()

  expect(_value0).toBe('initial state')

  expect(_value1).toBe('new state')

  setState('App_Component', 'mod2')
  expect(getState('App_Component')).toBe('mod2')

  expect(spy).not.toHaveBeenCalled()
  done()
})
