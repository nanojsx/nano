import * as Nano from '../core'
import { Component } from '../component'
import * as Router from '../components/router'

const pause = (ms: number = 1000): Promise<void> => new Promise(resolve => setTimeout(() => resolve(), ms))

const fetchPostMock = async (id: string) => {
  console.log(`fetch request to: /api/post/${id}`)
  await pause(250)
  return `this is the content of post #${id}`
}

const Container: Nano.FC<{ children: any }> = ({ children }) => <div style="padding: 2em;">{children}</div>

const Navigation = () => (
  <div style="display: flex; flex-direction: column;">
    <Router.Link to="/">Home</Router.Link>
    <Router.Link to="/about">About</Router.Link>
    <Router.Link to="/post">All Posts</Router.Link>
    <Router.Link to="/post/1">Post 1</Router.Link>
    <Router.Link to="/post/2">Post 2</Router.Link>
    <Router.Link to="/post/85">Post 85</Router.Link>
  </div>
)

class Post extends Component {
  route = Router.Listener.use()

  async didMount() {
    this.route.subscribe(async (currPath: string, prevPath: string) => {
      if (prevPath === currPath) return

      // console.log('------')
      // const match = Router.matchPath(currPath, { path: this.props.route.path })
      console.log(`Just navigated from ${prevPath} to ${currPath}`)
      // console.log(this.props.route)
      // console.log(match)
      // console.log('------')

      await this.loadPost()
    })
    await this.loadPost()
  }

  public didUnmount() {
    this.route.cancel()
  }

  async loadPost(currentPath = window.location.pathname) {
    const match = Router.matchPath(currentPath, { path: this.props.route.path })

    // fetch post by id
    const post = await fetchPostMock(match?.params?.id)

    if (match !== null) {
      this.update(post)
    }
  }

  render(content = 'loading...') {
    return <div style="padding: 16px;">{content}</div>
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
