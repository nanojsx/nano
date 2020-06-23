import Nano, { Component, Fragment } from '../lib/index.js'
import { wait, nodeToString } from './helpers.js'

const spy = jest.spyOn(global.console, 'error')

test('should render without errors', async (done) => {
  let PRE_RENDERED = false
  const dom = <div id="root"></div>

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
        <Content>This is the Content.</Content>
        <div id="menu">
          <Menu />
        </div>
      </Fragment>
    )
  }

  await wait()

  // render the whole app
  const menu = Nano.render(<Root />, dom)[1]
  PRE_RENDERED = true
  expect(nodeToString(menu)).toBe('<div id="menu"><p>The Menu</p></div>')

  await wait()

  // hydrate only the menu part of the app
  Nano.render(<Menu />, menu)

  await wait()

  expect(nodeToString(menu)).toBe('<div id="menu"><p>The Menu [HYDRATED]</p></div>')
  expect(spy).not.toHaveBeenCalled()
  done()
})
