import * as Nano from '../core'
import { Component } from '../component'
import * as Router from '../components/router'

const pause = (ms: number = 1000): Promise<void> => new Promise(resolve => setTimeout(() => resolve(), ms))

const fetchPostMock = async (id: string) => {
  await pause(Math.random() * 200 + 100)
  console.log(`[Fetch] /api/post/${id}`)
  return `this is the content of post #${id}`
}

const Container: Nano.FC<{ children: any }> = ({ children }) => <div style="padding: 2em;">{children}</div>

const Navigation = () => (
  <div style="display: flex; flex-wrap: wrap;">
    <style>
      {`a {
        margin-right: 18px;
        margin-bottom: 8px;
        text-decoration: none;
        color: blue;
      }`}
    </style>
    <Router.Link to="/">Home</Router.Link>
    <Router.Link to="/about">About</Router.Link>
    <Router.Link to="/post">All Posts</Router.Link>
    <Router.Link to="/post/1">Post 1</Router.Link>
    <Router.Link to="/post/2">Post 2</Router.Link>
    <Router.Link to="/post/3">Post 3</Router.Link>
  </div>
)

class Posts extends Component {
  constructor(props: any) {
    super(props)
    console.log('[Posts] constructor')
  }

  async didMount() {
    const posts = await Promise.all([fetchPostMock('1'), fetchPostMock('2'), fetchPostMock('3')])
    this.update(posts)
  }

  render(posts = ['loading...']) {
    return (
      <div>
        {posts.map((p: any) => (
          <div>{p}</div>
        ))}
      </div>
    )
  }
}

class Post extends Component {
  route = Router.Listener.use()

  constructor(props: any) {
    super(props)
    console.log('[Post] constructor')
  }

  async didMount() {
    this.route.subscribe(async (currPath: string, prevPath: string) => {
      if (prevPath === currPath) return

      // console.log('------')
      // const match = Router.matchPath(currPath, { path: this.props.route.path })
      // console.log(`Just navigated from ${prevPath} to ${currPath}`)
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

    if (match !== null) {
      const post = await fetchPostMock(match?.params?.id)
      this.update(post)
    }
  }

  render(content = 'loading...') {
    return <div>{content}</div>
  }
}

const Routes = () => (
  <div id="content" style="margin-top: 16px;">
    <Router.Switch fallback={() => <div>404 (not found)</div>}>
      <Router.Route exact path="/">
        <div>Welcome to my Homepage.</div>
      </Router.Route>
      <Router.Route exact path="/about">
        /About
      </Router.Route>
      <Router.Route exact path="/post">
        <Posts />
      </Router.Route>
      <Router.Route path="/post/:id">
        <Post />
      </Router.Route>
    </Router.Switch>
  </div>
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
