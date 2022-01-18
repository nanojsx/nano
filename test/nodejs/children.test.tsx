import Nano, { Component } from '../../lib/index.js'
import { wait } from './helpers.js'

const spy = jest.spyOn(global.console, 'error')

test('should render without errors', async () => {
  class RenderChildComponent extends Component {
    render() {
      // @ts-ignore
      return this.props.children
    }
  }

  const RenderChild = (props: any) => {
    return props.children
  }

  const ListElement = (props: any) => {
    return (
      <li>
        <span>Name: </span>
        <span>{props.children}</span>
      </li>
    )
  }
  const List = (props: any) => {
    return (
      <ul>
        {props.names.map((n: any) => {
          return (
            <ListElement>
              <RenderChild>
                <RenderChildComponent>{n}</RenderChildComponent>
              </RenderChild>
            </ListElement>
          )
        })}
      </ul>
    )
  }

  const Root = () => (
    <div id="root">
      <List names={['john', 'suzanne']} />
    </div>
  )
  const res = Nano.render(<Root />)

  await wait()
  expect(res.outerHTML).toBe(
    '<div id="root"><ul><li><span>Name: </span><span>john</span></li><li><span>Name: </span><span>suzanne</span></li></ul></div>'
  )
  expect(spy).not.toHaveBeenCalled()
})

test('Children as Component', async () => {
  const Child = () => <h1>Hello</h1>
  const Root = (props: any) => <div id="root">{props.children}</div>
  const html = Nano.render(
    <Root>
      <Child />
    </Root>
  )
  await wait()
  expect(html.outerHTML).toBe('<div id="root"><h1>Hello</h1></div>')
  expect(spy).not.toHaveBeenCalled()
})

test('Children as Props', async () => {
  const Child = () => <h1>Hello</h1>
  const Root = (props: any) => <div id="root">{props.children}</div>
  const html = Nano.render(<Root children={Child} />)
  await wait()
  expect(html.outerHTML).toBe('<div id="root"><h1>Hello</h1></div>')
  expect(spy).not.toHaveBeenCalled()
})

test('Children as Props (Array)', async () => {
  const Child = () => <h1>Hello</h1>
  const Root = (props: any) => <div id="root">{props.children}</div>
  const html = Nano.render(<Root children={[Child]} />)
  await wait()
  expect(html.outerHTML).toBe('<div id="root"><h1>Hello</h1></div>')
  expect(spy).not.toHaveBeenCalled()
})
