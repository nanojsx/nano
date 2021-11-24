import Nano, { Component, Fragment } from '../../lib/index.js'
import { wait, nodeToString } from './helpers.js'

const spy = jest.spyOn(global.console, 'error')

const root = document.createElement('div')
root.id = 'root'
document.body.appendChild(root)

test('should render without errors', async () => {
  let PRE_RENDERED = false

  class Menu extends Component {
    render() {
      return <p>{!PRE_RENDERED ? 'The Menu' : 'The Menu [HYDRATED]'}</p>
    }
  }

  class Content extends Component {
    render() {
      // @ts-ignore
      return <div id="content">{this.props.children}</div>
    }
  }

  const Root = () => {
    return (
      <Fragment>
        <div id="menu">
          <Menu />
        </div>
        <Content>This is the Content.</Content>
      </Fragment>
    )
  }

  // render the whole app
  const res1 = Nano.render(<Root />, document.getElementById('root'))
  expect(nodeToString(res1)).toBe(
    '<div id="root"><div id="menu"><p>The Menu</p></div><div id="content">This is the Content.</div></div>'
  )
  PRE_RENDERED = true

  // hydrate only the menu part of the app
  let res2 = Nano.render(<Menu />, document.getElementById('menu'))
  expect(nodeToString(res2)).toBe('<div id="menu"><p>The Menu [HYDRATED]</p></div>')

  // verify that the whole app is correctly displayed on the client
  expect(nodeToString(document.getElementById('root'))).toBe(
    '<div id="root"><div id="menu"><p>The Menu [HYDRATED]</p></div><div id="content">This is the Content.</div></div>'
  )

  expect(spy).not.toHaveBeenCalled()
})
