import { render, Component, Helmet, isSSR } from '../../lib/index.js'
import { initSSR } from '../../lib/ssr.js'
import { wait, nodeToString } from '../../test/nodejs/helpers.js'

const spy = jest.spyOn(global.console, 'error')

describe('jsx-runtime (client-side)', () => {
  test('should render without errors', async () => {
    const Root = () => (
      <div id="root">
        <h1>Hello</h1>
      </div>
    )
    const html = render(Root)
    await wait()
    expect(nodeToString(html)).toBe('<div id="root"><h1>Hello</h1></div>')
    expect(spy).not.toHaveBeenCalled()
  })

  test('should render without errors', async () => {
    const Root = () => (
      <div id="root">
        <Helmet>
          <title>TITLE</title>
          <meta name="description" content="DESCRIPTION" />
        </Helmet>
        <h1>Hello</h1>
      </div>
    )
    render(Root, document.body)
    await wait()
    expect(nodeToString(document.head)).toBe(
      '<head><title>TITLE</title><meta name="description" content="DESCRIPTION"></head>'
    )
    expect(nodeToString(document.body)).toBe('<body><div id="root"><h1>Hello</h1></div></body>')
    expect(spy).not.toHaveBeenCalled()
  })
})
