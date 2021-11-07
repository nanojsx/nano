import * as Nano from '../core'
import { Component } from '../component'
import * as Router from '../components/router'

const Container: Nano.FC<{ children: any }> = ({ children }) => <div style="padding: 2em;">{children}</div>

const Navigation = () => (
  <div style="display: flex; flex-direction: column;">
    <Router.Link to="/">Home</Router.Link>
    <Router.Link to="/about">About</Router.Link>
    <Router.Link to="/post">Posts</Router.Link>
    <Router.Link to="/post/1">Post1</Router.Link>
    <Router.Link to="/post/2">Post3</Router.Link>
    <Router.Link to="/post/3">Post4</Router.Link>
  </div>
)

class Post extends Component {
  listener = Router.Listener.use()

  didMount() {
    this.listener.subscribe((newPath: string, currPath: string) => {
      console.log(newPath, currPath)
    })
  }

  didUnmount() {
    this.listener.cancel()
  }

  render() {
    return <div style="padding: 16px;">post</div>
  }
}

const Routes = () => (
  <Router.Switch fallback={() => <div>404 (not found)</div>}>
    <Router.Route exact path="/"></Router.Route>
    <Router.Route path="/post/:id">
      <Post />
    </Router.Route>
  </Router.Switch>
)

class App extends Component {
  render() {
    return (
      <Container>
        <small>
          <a href="http://127.0.0.1:5500/dev/dev.html">start</a>
        </small>
        <h1>Nano JSX App</h1>
        <Navigation />
        <Routes />
      </Container>
    )
  }
}

Nano.render(<App />, document.getElementById('root'))
