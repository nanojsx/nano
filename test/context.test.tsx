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
            return <p>{value}</p>
          }}
        </MyContext.Consumer>
      )
    }
  }

  class Parent extends Component {
    render() {
      return (
        <MyContext.Provider value={this.props.name}>
          <Child />
        </MyContext.Provider>
      )
    }
  }

  const res = Nano.render(
    <div id="root">
      <Parent name="suzanne" />
    </div>
  )

  await wait()
  expect(nodeToString(res)).toBe('<div id="root"><p>suzanne</p></div>')
  expect(spy).not.toHaveBeenCalled()
  done()
})

test('should render without errors', async (done) => {
  const MyContext = Nano.createContext('suzanne')

  const Child = () => {
    return (
      <MyContext.Consumer>
        {(value: any) => {
          return <p>{value}</p>
        }}
      </MyContext.Consumer>
    )
  }

  const Parent = (props: any) => {
    return (
      <MyContext.Provider value={props.name}>
        <Child />
      </MyContext.Provider>
    )
  }

  const res = Nano.render(
    <div id="root">
      <Parent name="john" />
    </div>
  )

  await wait()
  expect(nodeToString(res)).toBe('<div id="root"><p>john</p></div>')
  expect(spy).not.toHaveBeenCalled()
  done()
})
