/**
 * @jest-environment node
 */

import Nano, { Component, renderSSR } from '../../lib/index.js'
import * as Router from '../../lib/components/router.js'

const spy = jest.spyOn(global.console, 'error')

test('should render without errors', () => {
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

  let Hello = (p:any)=> (<div>hello {p.route.params.name}</div>)

  class App extends Component {
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
            <Router.Route path="/hello/:name">
              <Hello />
            </Router.Route>
          </Router.Switch>
        </div>
      )
    }
  }

  const defaultRoute = renderSSR(<App />)
  expect(defaultRoute).toBe('<div id="root"><div><div>Home Route</div></div></div>')

  const aboutRoute = renderSSR(<App />, { pathname: '/about' })
  expect(aboutRoute).toBe('<div id="root"><div><div>About Route</div></div></div>')

  const childOne = renderSSR(<App />, { pathname: '/children/one' })
  expect(childOne).toBe('<div id="root"><div><div id="children"><div><div>Child One</div></div></div></div></div>')

  const childTwo = renderSSR(<App />, { pathname: '/children/two' })
  expect(childTwo).toBe('<div id="root"><div><div id="children"><div><div>Child Two</div></div></div></div></div>')

  const homeRoute = renderSSR(<App />, { pathname: '/' })
  expect(homeRoute).toBe('<div id="root"><div><div>Home Route</div></div></div>')

  const regexRoute = renderSSR(<App />, { pathname: '/abc123' })
  expect(regexRoute).toBe('<div id="root"><div><div>Regex Route</div></div></div>')

  const routeParams = renderSSR(<App />, { pathname: '/hello/world' })
  expect(routeParams).toBe('<div id="root"><div><div>hello world</div></div></div>')

  const notFound = renderSSR(<App />, { pathname: '/nothing' })
  expect(notFound).toBe('<div id="root"><div><div>404: Page Not Found</div></div></div>')

  expect(spy).not.toHaveBeenCalled()
})
