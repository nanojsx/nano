## Router example

Works client-side and server-side.

```tsx
import * as Nano from '../core'
import * as Router from '../router'
import { Component } from '../component'
import { Fragment } from '../fragment'

const Nothing = () => <div></div>

const Home = (props: any) => {
  return (
    <Fragment>
      <h2>Home Page</h2>
      <p>Nothing on route "{props.route.path}"</p>
    </Fragment>
  )
}

const Latte = () => {
  return <span>Latte</span>
}

class Drinks extends Component {
  render() {
    const { path } = this.props.route
    return (
      <Fragment>
        <h2>Drinks</h2>

        <ul>
          <li>
            <Router.Link to={`${path}/latte`}>Latte</Router.Link>
          </li>
          <li>
            <Router.Link to={`${path}/milk`}>Milk</Router.Link>
          </li>
        </ul>

        <div class="router">
          <Router.Switch>
            <Router.Route path={`${path}`}>
              <Nothing />
            </Router.Route>
            <Router.Route path={`${path}/latte`}>
              <Latte />
            </Router.Route>
            <Router.Route path={`${path}/milk`}>{() => <span>Milk</span>}</Router.Route>
          </Router.Switch>
        </div>
      </Fragment>
    )
  }
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
          <li>
            <Router.Link to="/no">404</Router.Link>
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
            <Router.Route path="*">{() => <div>404</div>}</Router.Route>
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
