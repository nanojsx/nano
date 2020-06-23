import Nano, { Component, Fragment } from '../lib/index.js'
import { wait, nodeToString } from './helpers.js'

const spy = jest.spyOn(global.console, 'error')

test('should render without errors', async (done) => {
  const MyContext = Nano.createContext('john')

  class Child extends Component {
    render() {
      return (
        <MyContext.Consumer>
          {(value: any) => {
            return <div>{value}</div>
          }}
        </MyContext.Consumer>
      )
    }
  }

  class Root extends Component {
    render() {
      return (
        <div>
          <MyContext.Provider value={this.props.name}>
            <Child />
          </MyContext.Provider>
        </div>
      )
    }
  }

  const res = Nano.render(<Root name="suzanne" />)

  await wait()
  expect(nodeToString(res)).toBe('<div><div>suzanne</div></div>')
  expect(spy).not.toHaveBeenCalled()
  done()
})

test('should render without errors', async (done) => {
  const MyContext = Nano.createContext('john')

  const Child = () => {
    return (
      <MyContext.Consumer>
        {(value: any) => {
          return <div>{value}</div>
        }}
      </MyContext.Consumer>
    )
  }

  const Root = (props: any) => {
    return (
      <div>
        <MyContext.Provider value={props.name}>
          <Child />
        </MyContext.Provider>
      </div>
    )
  }

  const res = Nano.render(<Root name="suzanne" />)

  await wait()
  expect(nodeToString(res)).toBe('<div><div>suzanne</div></div>')
  expect(spy).not.toHaveBeenCalled()
  done()
})
