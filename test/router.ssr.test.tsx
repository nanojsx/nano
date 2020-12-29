/**
 * @jest-environment node
 */

import Nano, { Component, renderSSR } from '../lib/index.js'
import * as Router from '../lib/router.js'

const spy = jest.spyOn(global.console, 'error')

test('should render without errors', () => {
  class App extends Component {
    render() {
      return (
        <div id="root">
          <Router.Switch>
            <Router.Route exact path="/">
              <div>Home Route</div>
            </Router.Route>
            <Router.Route path="/about">
              <div>About Route</div>
            </Router.Route>
          </Router.Switch>
        </div>
      )
    }
  }

  const homeRoute = renderSSR(<App />)
  expect(homeRoute).toBe('<div id="root"><div>Home Route</div></div>')

  const aboutRoute = renderSSR(<App />, { pathname: '/about' })
  expect(aboutRoute).toBe('<div id="root"><div>About Route</div></div>')

  const notFound = renderSSR(<App />, { pathname: '/abut' })
  expect(notFound).toBe('<div id="root"><div class="route">not found</div></div>')

  expect(spy).not.toHaveBeenCalled()
})
