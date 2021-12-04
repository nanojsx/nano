import { Route, Switch, Link, Listener } from '../components/router'
import { h, render } from '../core'
import { Component } from '../component'

const fetchPostMock = (id: string) =>
  new Promise(resolve => setTimeout(() => resolve(`This is post #${id}`), Math.random() * 200 + 200))

const getParamsFromPath = (path: string) => {
  let params = {}

  const _pathname = window.location.pathname.split('/')

  path.split('/').forEach((p, i) => {
    if (p.startsWith(':')) params = { ...params, [p.slice(1)]: _pathname[i] }
  })

  return params
}

class HomePage extends Component {
  constructor(props: any) {
    super(props)
    console.log('[HomePage] constructor')
  }

  didMount() {
    console.log('[HomePage] didMount')
  }

  render() {
    return <div>HomePage</div>
  }
}

class AboutPage extends Component {
  constructor(props: any) {
    super(props)
    console.log('[AboutPage] constructor')
  }

  didMount() {
    console.log('[AboutPage] didMount')
  }

  render() {
    return <div>AboutPage</div>
  }
}

class BlogPage extends Component {
  listener = Listener().use()

  constructor(props: any) {
    super(props)
    console.log('[BlogPage] constructor')
  }

  async getPost() {
    const params = getParamsFromPath(this.props.route.path) as { id: string }
    if (params?.id) {
      const post = await fetchPostMock(params.id)
      this.update(post)
    }
  }

  async didMount() {
    console.log('[BlogPage] didMount')

    this.listener.subscribe((curr, prev) => {
      if (curr !== prev && /^\/blog\/\d+$/.test(curr)) {
        this.getPost()
      }
    })

    this.getPost()
  }

  public didUnmount() {
    this.listener.cancel()
  }

  render(post: string) {
    if (post) return <div>{post}</div>
    return <div>loading...</div>
  }
}

class App extends Component {
  render() {
    return (
      <div id="root">
        <a href="/dev/dev.html">restart</a>

        <style>
          {`
          nav {
            padding: 8px;
            display: flex;
            flex-direction: column;
          }
          nav a {
            padding: 4px;
          }
          section {
            padding:8px;
          }`}
        </style>

        <nav>
          <Link to="/">Home</Link>
          <Link to="/about">About</Link>
          <Link to="/blog/219">Blog #219</Link>
          <Link to="/blog/584">Blog #584</Link>
          <Link to="/blog/855">Blog #855</Link>
        </nav>

        <section>
          <Switch>
            <Route exact path="/">
              <HomePage />
            </Route>
            <Route exact path="/about">
              <AboutPage />
            </Route>
            <Route exact path="/blog/:id">
              <BlogPage />
            </Route>
          </Switch>
        </section>
      </div>
    )
  }
}

render(<App />, document.getElementById('root'))
