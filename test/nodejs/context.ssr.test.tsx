/**
 * @jest-environment node
 */

import Nano, { Component, createContext, useContext } from '../../lib/index.js'
import { initSSR, renderSSR } from '../../lib/ssr.js'

/**
 * @description
 * Same as "context.test.tsx" but for SSR.
 */

const spy = jest.spyOn(global.console, 'error')

initSSR()

test('should render without errors', async () => {
  const MyContext = createContext('john')

  class Child extends Component {
    render() {
      if (MyContext.get() === 'yannick') MyContext.set('aika')

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
        <div id="root">
          <MyContext.Provider value={this.props.name}>
            <Child />
          </MyContext.Provider>
        </div>
      )
    }
  }

  // render
  const defaultRender = renderSSR(<Parent name="suzanne" />)
  expect(defaultRender).toBe('<div id="root"><p>suzanne</p></div>')

  expect(spy).not.toHaveBeenCalled()

  // render again and change the context in didMount()
  const changedRender = renderSSR(<Parent name="yannick" />)
  expect(changedRender).toBe('<div id="root"><p>aika</p></div>')

  expect(spy).not.toHaveBeenCalled()

  // set/get context outside components
  expect(useContext(MyContext)).toBe('aika')
  MyContext.set('tom')
  expect(useContext(MyContext)).toBe('tom')

  expect(spy).not.toHaveBeenCalled()
})

test('should render without errors', async () => {
  const MyContext = createContext('suzanne')

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
      <div id="root">
        <MyContext.Provider value={props.name}>
          <Child />
        </MyContext.Provider>
      </div>
    )
  }

  const defaultRender = renderSSR(<Parent name="john" />)
  expect(defaultRender).toBe('<div id="root"><p>john</p></div>')
  expect(spy).not.toHaveBeenCalled()
})

test('should render without errors', async () => {
  const UserContext = createContext('Unknown')

  class Child extends Component {

    willMount() {
      if (useContext(UserContext) === 'yannick') UserContext.set('aika')
    }

    render() {
      const value = useContext(UserContext)

      return <p>{value}</p>
    }
  }

  class Parent extends Component {
    render() {
      return (
        <div id="root">
          <UserContext.Provider value={this.props.name}>
            <Child />
          </UserContext.Provider>
        </div>
      )
    }
  }

  const defaultRender = renderSSR(<Parent name="suzanne" />)
  expect(defaultRender).toBe('<div id="root"><p>suzanne</p></div>')

  expect(spy).not.toHaveBeenCalled()

  // render again and change the context in willMount()
  const changedRender = renderSSR(<Parent name="yannick" />)
  expect(changedRender).toBe('<div id="root"><p>aika</p></div>')

  expect(spy).not.toHaveBeenCalled()

  // set/get context outside components
  expect(useContext(UserContext)).toBe('aika')
  UserContext.set('tom')
  expect(useContext(UserContext)).toBe('tom')

  expect(spy).not.toHaveBeenCalled()
})

test('should render without errors', async () => {
  const UserContext = createContext('suzanne')

  const Child = () => {
    const value = useContext(UserContext)
    return <p>{value}</p>
  }

  const Parent = (props: any) => {
    return (
      <div id="root">
        <UserContext.Provider value={props.name}>
          <Child />
        </UserContext.Provider>
      </div>
    )
  }

  const defaultRender = renderSSR(<Parent name="john" />)
  expect(defaultRender).toBe('<div id="root"><p>john</p></div>')
  expect(spy).not.toHaveBeenCalled()
})
