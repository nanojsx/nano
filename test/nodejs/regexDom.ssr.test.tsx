/**
 * @jest-environment node
 */

import { initSSR } from '../../lib/ssr.js'
import { DocumentSSR, HTMLElementSSR } from '../../lib/regexDom.js'

const spy = jest.spyOn(global.console, 'error')

test('set innerText', () => {
  const div = new HTMLElementSSR('div')

  div.innerText = 'hello'
  expect(div.outerHTML).toBe('<div>hello</div>')

  div.innerText = '<p>hello</p>'
  expect(div.outerHTML).toBe('<div><p>hello</p></div>')

  div.innerText = '<p>I payed $199 for my new SSD.</p>'
  expect(div.outerHTML).toBe('<div><p>I payed $199 for my new SSD.</p></div>')
})

test('setAttribute', () => {
  let div = new HTMLElementSSR('div')
  div.setAttribute('name', 'value')
  expect(div.outerHTML).toBe('<div name="value"></div>')

  div = new HTMLElementSSR('div')
  div.setAttribute('amount', '$199')
  expect(div.outerHTML).toBe('<div amount="$199"></div>')
})

test('should behave like "normal" DOM Document', () => {
  initSSR()

  let div = document.createElement('div')
  expect(div.toString()).toBe('<div></div>')

  div.setAttributeNS(null, 'id', 'root')
  expect(div.classList.entries.length).toBe(0)
  expect(div.toString()).toBe('<div id="root"></div>')

  const ul = document.createElement('ul')
  const li_0 = document.createElement('li')
  const li_1 = document.createElement('li')
  expect(li_0.innerText).toBe('')
  expect(li_0.innerHTML).toBe('')
  li_0.innerText = 'one'
  li_1.innerText = 'two'
  expect(li_0.innerText).toBe('one')
  expect(li_0.innerHTML).toBe('one')
  ul.appendChild(li_0)
  ul.appendChild(li_1)
  div.appendChild(ul)
  expect(div.toString()).toBe('<div id="root"><ul><li>one</li><li>two</li></ul></div>')

  const children = ul.children
  expect(children[0]).toBe('<li>one</li>')
  expect(children[1]).toBe('<li>two</li>')
  ul.addEventListener('click', () => {})

  // new div
  div = document.createElement('div')
  div.classList.add('nano')

  // has one class
  expect(div.classList.entries.length).toBe(1)

  // append child
  const newChild = document.createElement('span')
  newChild.innerText = 'hello'
  div.appendChild(newChild)
  expect(div.toString()).toBe('<div class="nano"><span>hello</span></div>')
  expect(div.innerText).toBe('<span>hello</span>')

  // append another child
  const anotherNewChild = document.createElement('span')
  anotherNewChild.innerText = 'another hello'
  div.append(anotherNewChild)
  expect(div.toString()).toBe('<div class="nano"><span>hello</span><span>another hello</span></div>')
  expect(div.innerText).toBe('<span>hello</span><span>another hello</span>')

  // querySelector always returns undefined
  expect(document.querySelector('#id')).toBeUndefined()

  const elementNS = document.createElementNS(null, 'div')
  expect(elementNS.outerHTML).toBe('<div></div>')
  expect(elementNS.innerHTML).toBe('')

  const textNode = document.createTextNode('This is a text node.')
  expect(textNode).toBe('This is a text node.')

  const textNodeEscaped = document.createTextNode('This is a es<aped text node.')
  expect(textNodeEscaped).toBe('This is a es&lt;aped text node.')

  // always return null
  expect(div.getAttribute('something')).toBeNull()
})
