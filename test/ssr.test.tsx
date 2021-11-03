/**
 * @jest-environment node
 */

import Nano, { Img, Helmet } from '../lib/index.js'
import { initSSR, HTMLElementSSR, renderSSR } from '../lib/ssr.js'

const spy = jest.spyOn(global.console, 'error')

test('should render without errors', () => {
  initSSR()

  // @ts-ignore
  const div = document.createElement('div') as HTMLElementSSR
  expect(div.ssr).toBe('<div></div>')

  div.setAttributeNS('id', 'root')
  expect(div.ssr).toBe('<div id="root"></div>')

  const ul = new HTMLElementSSR('ul')
  const li_0 = new HTMLElementSSR('li')
  const li_1 = new HTMLElementSSR('li')
  li_0.innerText = 'one'
  li_1.innerText = 'two'
  ul.appendChild(li_0)
  ul.appendChild(li_1)
  div.appendChild(ul)
  expect(div.ssr).toBe('<div id="root"><ul><li>one</li><li>two</li></ul></div>')

  const children = ul.children
  expect(children[0]).toBe('<li>one</li>')
  expect(children[1]).toBe('<li>two</li>')
  //@ts-ignore
  ul.addEventListener('click', () => {})

  const newChild = new HTMLElementSSR('span')
  newChild.innerText = 'hello'
  div.replaceChild(newChild)
  expect(div.ssr).toBe('<div id="root"><span>hello</span></div>')

  // others
  expect(div.outerHTML).toBe('<div id="root"><span>hello</span></div>')
  expect(div.innerText).toBe('<span>hello</span>')
  expect(document.querySelector('#id')).toBeUndefined() // querySelector always return undefined in SSR

  // @ts-ignore
  expect(document.createElementNS('URI', 'div').ssr).toBe('<div></div>')
})

test('should render without errors', async () => {
  const App = () => {
    return (
      <div>
        <Helmet>
          <title>some title</title>
          <meta name="description" content="Nano-JSX application" />
        </Helmet>
        <Img src="some-url" placeholder="placeholder-url" />
      </div>
    )
  }

  const app = Nano.renderSSR(<App />)
  const { body, head } = Helmet.SSR(app)

  const html = `
  <!DOCTYPE html>
  <html lang="en">
    <head>
      ${head.join('\n')}
    </head>
    <body>
      ${body}
    </body>
  </html>
  `

  expect(html).toBe(`
  <!DOCTYPE html>
  <html lang="en">
    <head>
      <title>some title</title><meta content="Nano-JSX application" name="description" />
    </head>
    <body>
      <div><img src="placeholder-url" /></div>
    </body>
  </html>
  `)
  expect(spy).not.toHaveBeenCalled()
})

test("should escape attribute's string value", () => {
  const content = Nano.h('div', { id: '"hoge' }, '<span>span</span>')
  const html = renderSSR(content)
  expect(html).toBe('<div id="&quot;hoge"><span>span</span></div>')
})
