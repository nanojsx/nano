import Nano, { Component } from '../../lib/index.js'
import { wait, nodeToString } from './helpers.js'
import * as Router from '../../lib/components/router.js'

const spy = jest.spyOn(global.console, 'error')

afterEach(() => {
  document.getElementsByTagName('html')[0].innerHTML = ''
  window.history.pushState({}, '', '/')
})

test('render routes from array', async () => {
  const Home = () => <h1>Home</h1>
  const About = () => <h1>About</h1>

  const routes = [
    {
      path: '/',
      exact: true,
      Comp: Home
    },
    {
      path: '/about',
      exact: false,
      Comp: About
    }
  ]

  const App = () => {
    return (
      <Router.Switch fallback={() => <div>404 (not found)</div>}>
        {routes.map(({ exact, path, Comp }) => {
          return (
            <Router.Route exact={exact} path={path}>
              <Comp />
            </Router.Route>
          )
        })}
      </Router.Switch>
    )
  }

  const res = Nano.render(<App />, document.body)

  await wait(100)
  expect(nodeToString(res)).toBe('<body><div><h1>Home</h1></div></body>')

  await wait(100)
  Router.to('/about')

  await wait(100)
  expect(nodeToString(res)).toBe('<body><div><h1>About</h1></div></body>')

  await wait(100)
  Router.to('/404')

  await wait(100)
  expect(nodeToString(res)).toBe('<body><div><div>404 (not found)</div></div></body>')
})

test('should render without errors', async () => {
  class Children extends Component {
    render() {
      return (
        <div id="children">
          <Router.Switch>
            <Router.Route exact path="/children/one">
              <div>Child One</div>
            </Router.Route>
            <Router.Route path="/children/two">
              <div>Child Two</div>
            </Router.Route>
          </Router.Switch>
        </div>
      )
    }
  }

  class App extends Component {
    didMount() {
      setTimeout(() => Router.to('/about'), 200)
      setTimeout(() => Router.to('/children/one'), 400)
      setTimeout(() => Router.to('/children/two'), 600)
      setTimeout(() => Router.to('/'), 800)
      setTimeout(() => Router.to('/abc123'), 1000)
      setTimeout(() => Router.to('/nothing'), 1200)
    }

    render() {
      return (
        <div id="root">
          <Router.Switch fallback={() => <div>404: Page Not Found</div>}>
            <Router.Route exact path="/">
              <div>Home Route</div>
            </Router.Route>
            <Router.Route path="/about">
              <div>About Route</div>
            </Router.Route>
            <Router.Route path="/:id" regex={{ id: /^[a-f0-9]{6}$/ }}>
              <div>Regex Route</div>
            </Router.Route>
            <Router.Route path="/children">
              <Children />
            </Router.Route>
          </Router.Switch>
        </div>
      )
    }
  }

  const res = Nano.render(<App />, document.body)

  await wait(100)
  expect(nodeToString(res)).toBe('<body><div id="root"><div><div>Home Route</div></div></div></body>')

  await wait(200)
  expect(nodeToString(res)).toBe('<body><div id="root"><div><div>About Route</div></div></div></body>')

  await wait(200)
  expect(nodeToString(res)).toBe(
    '<body><div id="root"><div><div id="children"><div><div>Child One</div></div></div></div></div></body>'
  )

  await wait(200)
  expect(nodeToString(res)).toBe(
    '<body><div id="root"><div><div id="children"><div><div>Child Two</div></div></div></div></div></body>'
  )

  await wait(200)
  expect(nodeToString(res)).toBe('<body><div id="root"><div><div>Home Route</div></div></div></body>')

  await wait(200)
  expect(nodeToString(res)).toBe('<body><div id="root"><div><div>Regex Route</div></div></div></body>')

  await wait(200)
  expect(nodeToString(res)).toBe('<body><div id="root"><div><div>404: Page Not Found</div></div></div></body>')

  expect(spy).not.toHaveBeenCalled()
})
