import { renderSSR, Component, Helmet, isSSR } from '../../lib/index.js'
import { detectSSR } from '../../lib/helpers.js'
import { initSSR } from '../../lib/ssr.js'

// I don't use jest here because it generated too many unexpected errors.

let hasErrors = false
const tests = []

const expect = one => {
  return {
    toBe: two => {
      const match = one === two
      if (match === false) {
        hasErrors = true
        console.log(`> ERROR: "${one} does NOT match "${two}"`)
      } else {
        console.log('> ok')
      }
      return match
    }
  }
}

const test = fnc => {
  tests.push(fnc)
}

test(() => {
  const Root = () => (
    <div id="root">
      <h1>Hello</h1>
    </div>
  )
  initSSR('/')
  const html = renderSSR(() => <Root />)
  expect(html).toBe('<div id="root"><h1>Hello</h1></div>')
})

test(() => {
  const Root = () => (
    <div id="root">
      <Helmet>
        <title>TITLE</title>
        <meta name="description" content="DESCRIPTION" />
      </Helmet>
      <h1>Hello</h1>
    </div>
  )
  const html = renderSSR(<Root />)
  const { body, head } = Helmet.SSR(html)
  expect(head[0]).toBe('<title>TITLE</title><meta content="DESCRIPTION" name="description" />')
  expect(body).toBe('<div id="root"><h1>Hello</h1></div>')
})

// Children as Component
test(() => {
  const Child = () => <h1>Hello</h1>
  const Root = (props: any) => <div id="root">{props.children}</div>
  const html = renderSSR(
    <Root>
      <Child />
    </Root>
  )
  expect(html).toBe('<div id="root"><h1>Hello</h1></div>')
})

// Children as Props
test(() => {
  const Child = () => <h1>Hello</h1>
  const Root = (props: any) => <div id="root">{props.children}</div>
  const html = renderSSR(<Root children={Child} />)
  expect(html).toBe('<div id="root"><h1>Hello</h1></div>')
})

// Children as Props (Array)
test(() => {
  const Child = () => <h1>Hello</h1>
  const Root = (props: any) => <div id="root">{props.children}</div>
  const html = renderSSR(<Root children={[Child]} />)
  expect(html).toBe('<div id="root"><h1>Hello</h1></div>')
})

for (const test of tests) {
  test()
}

if (hasErrors) {
  process.exit(1)
} else {
  process.exit(0)
}
