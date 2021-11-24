import Nano, { Component } from '../../lib/index.js'
import { wait } from './helpers.js'

const spy = jest.spyOn(global.console, 'error')

test('should render without errors', async () => {
  const results: any[] = []

  class App extends Component {
    didMount() {
      this.setState({ value: 3 })
      results.push({ ...this.state })

      this.setState({ counter: 22 })
      results.push({ ...this.state })

      this.setState({ value: 4 })
      results.push({ ...this.state })

      this.setState({ counter: (this.state.counter += 5) })
      results.push({ ...this.state })

      this.setState({ value: 10, counter: 50, new: 20 })
      results.push({ ...this.state })
    }

    render() {
      return <div>Nano JSX App</div>
    }
  }

  Nano.render(<App />, document.body)

  await wait()

  expect(JSON.stringify(results[0])).toBe('{"value":3}')
  expect(JSON.stringify(results[1])).toBe('{"value":3,"counter":22}')
  expect(JSON.stringify(results[2])).toBe('{"value":4,"counter":22}')
  expect(JSON.stringify(results[3])).toBe('{"value":4,"counter":27}')
  expect(JSON.stringify(results[4])).toBe('{"value":10,"counter":50,"new":20}')

  expect(spy).not.toHaveBeenCalled()
})
