## Router example

Works client-side and server-side.

```tsx
import * as Nano from '../core'
import * as Router from '../router'
import { Component } from '../component'
import { Fragment } from '../fragment'

const Nothing = () => <div></div>

const Home = () => (
  <Fragment>
    <h2>Home Page</h2>
    <p>Nothing here</p>
  </Fragment>
)

const Latte = () => {
  return <span>Latte</span>
}

const Drinks = () => {
  return (
    <Fragment>
      <h2>Drinks</h2>

      <ul>
        <li>
          <Router.Link to="/drinks/latte">Latte</Router.Link>
        </li>
        <li>
          <Router.Link to="/drinks/milk">Milk</Router.Link>
        </li>
      </ul>

      <div class="router">
        <Router.Switch>
          <Router.Route path="/drinks">
            <Nothing />
          </Router.Route>
          <Router.Route path="/drinks/latte">
            <Latte />
          </Router.Route>
          <Router.Route path="/drinks/milk">
            <span>Milk</span>
          </Router.Route>
        </Router.Switch>
      </div>
    </Fragment>
  )
}

class App extends Component {
  render() {
    return (
      <Fragment>
        <h1>Router Example</h1>

        <ul>
          <li>
            <Router.Link to="/dev/dev.html">Home</Router.Link>
          </li>
          <li>
            <Router.Link to="/drinks">Drinks</Router.Link>
          </li>
        </ul>

        <div class="router">
          <Router.Switch>
            <Router.Route path="/dev/dev.html">
              <Home />
            </Router.Route>
            <Router.Route path="/drinks">
              <Drinks />
            </Router.Route>
          </Router.Switch>
        </div>
      </Fragment>
    )
  }
}

// client side
Nano.render(<App />, document.getElementById('root'))

// server side
const app = renderSSR(<App />, { pathname: '/drinks/milk' })
```
