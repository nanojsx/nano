import Nano, { Component, withStyles } from '../../lib/index.js'
import { wait, nodeToString, multiLineToSingleLine } from './helpers.js'

const spy = jest.spyOn(global.console, 'error')

afterEach(async () => {
  // reset jsdom document
  document.body.innerHTML = ''
  document.head.innerHTML = ''
  await wait()
})

test('should render without errors', async () => {
  class AppA extends Component {
    render() {
      return (
        <div>
          <p>with styles</p>
        </div>
      )
    }
  }

  const App = withStyles('some css')(AppA)

  const res = Nano.render(<App />, document.body)

  await wait()
  expect(nodeToString(res)).toBe('<body><div><p>with styles</p></div></body>')
  expect(document.head.innerHTML).toBe('<style>some css</style>')
  expect(spy).not.toHaveBeenCalled()
})

test('should render without errors', async () => {
  class AppA extends Component {
    render() {
      return <div>{this.props.children}</div>
    }
  }

  const App = withStyles('some css')(AppA)

  const res = Nano.render(
    <App>
      <p>with styles</p>
    </App>,
    document.body
  )

  await wait()
  expect(nodeToString(res)).toBe('<body><div><p>with styles</p></div></body>')
  expect(document.head.innerHTML).toBe('<style>some css</style>')
  expect(spy).not.toHaveBeenCalled()
})

test('should not escape webfonts and single quotes', async () => {
  class AppA extends Component {
    render() {
      return <div>{this.props.children}</div>
    }
  }

  const App = withStyles(`
    @import url("https://fonts.googleapis.com/css?family=Montserrat:400,700|Roboto:100,300,400");

    body {
      font-family: 'Montserrat', 'Roboto', sans-serif;
    }
  `)(AppA)

  Nano.render(
    <App>
      <p>with styles</p>
    </App>,
    document.body
  )

  await wait()
  expect(multiLineToSingleLine(document.head.innerHTML)).toBe(
    "<style>@import url(\"https://fonts.googleapis.com/css?family=Montserrat:400,700|Roboto:100,300,400\");body {font-family: 'Montserrat', 'Roboto', sans-serif;}</style>"
  )
  expect(spy).not.toHaveBeenCalled()
})
