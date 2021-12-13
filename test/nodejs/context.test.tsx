import Nano, { Component, Fragment, createContext, useContext } from '../../lib/index.js'
import { wait, nodeToString } from './helpers.js'

const spy = jest.spyOn(global.console, 'error')

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
        <MyContext.Provider value={this.props.name}>
          <Child />
        </MyContext.Provider>
      )
    }
  }

  // render
  let res = Nano.render(
    <div id="root">
      <Parent name="suzanne" />
    </div>
  )
  await wait()
  expect(nodeToString(res)).toBe('<div id="root"><p>suzanne</p></div>')
  expect(spy).not.toHaveBeenCalled()

  // render again and change the context in didMount()
  res = Nano.render(
    <div id="root">
      <Parent name="yannick" />
    </div>
  )
  await wait()
  expect(nodeToString(res)).toBe('<div id="root"><p>aika</p></div>')
  expect(spy).not.toHaveBeenCalled()

  // set/get context outside components
  expect(MyContext.get()).toBe('aika')
  MyContext.set('tom')
  expect(MyContext.get()).toBe('tom')
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
})

test('should render without errors', async () => {
  const UserContext = createContext('Unknown');

  class Child extends Component {
    render() {
      if (useContext(UserContext) === 'yannick') UserContext.set('aika')
      const value = useContext(UserContext)

      return <p>{value}</p>
    }
  }

  class Parent extends Component {
    render() {
      return (
        <UserContext.Provider value={this.props.name}>
          <Child />
        </UserContext.Provider>
      )
    }
  }

  // render
  let res = Nano.render(
    <div id="root">
      <Parent name="suzanne" />
    </div>
  )
  await wait()
  expect(nodeToString(res)).toBe('<div id="root"><p>suzanne</p></div>')
  expect(spy).not.toHaveBeenCalled()

  // render again and change the context in didMount()
  res = Nano.render(
    <div id="root">
      <Parent name="yannick" />
    </div>
  )
  await wait()
  expect(nodeToString(res)).toBe('<div id="root"><p>aika</p></div>')
  expect(spy).not.toHaveBeenCalled()

  // set/get context outside components
  expect(useContext(UserContext)).toBe('aika')
  UserContext.set('tom')
  expect(useContext(UserContext)).toBe('tom')
})

test('should render without errors', async () => {
  const UserContext = createContext('suzanne')

  const Child = () => {
    const value = useContext(UserContext)
    return <p>{value}</p>
  }

  const Parent = (props: any) => {
    return (
      <UserContext.Provider value={props.name}>
        <Child />
      </UserContext.Provider>
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
})
