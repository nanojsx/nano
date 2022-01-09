import Nano, { Helmet } from '../../../lib/index.js'
import { wait, nodeToString, multiLineToSingleLine } from '../helpers.js'

const spy = jest.spyOn(global.console, 'error')

const appendEmptyRootElement = async () => {
  document.body.appendChild(Nano.render(() => <div id="root">loading...</div>))
  await wait()
}

const renderComponentToRoot = async (Component: any) => {
  Nano.render(Component, document.getElementById('root'))
  await wait()
}

afterEach(async () => {
  // reset jsdom document
  document.body.innerHTML = ''
  document.head.innerHTML = ''
  await wait()
})

describe('<Helmet> Browser', () => {
  test('should render without errors', async () => {
    const dynamic = 'dynamic'

    const Root = () => (
      <div id="root">
        <Helmet>
          {/* html attributes */}
          <html lang="en" amp />

          {/* body attributes */}
          <body class="root" />

          {/* title element */}
          <title>My Plain Title or {dynamic} title</title>

          {/* meta elements */}
          <meta name="description" content="Nano-JSX application" />

          {/* meta elements */}
          <link rel="canonical" href="http://mysite.com/example" />
        </Helmet>
      </div>
    )

    const root = Nano.h('div', { id: 'root' }) as HTMLElement
    const desc = Nano.h('meta', { name: 'description', content: 'Nano-JSX application' }) as HTMLElement
    document.head.appendChild(desc)
    document.body.appendChild(root)

    Nano.render(<Root />, document.getElementById('root'))

    await wait()
    expect(document.getElementsByTagName('HTML')[0].getAttribute('lang')).toBe('en')
    expect(document.getElementsByTagName('HTML')[0].getAttribute('amp')).toBe('true')
    expect(document.head.innerHTML).toBe(
      '<meta name="description" content="Nano-JSX application"><title>My Plain Title or dynamic title</title><link rel="canonical" href="http://mysite.com/example">'
    )
    expect(document.body.innerHTML).toBe('<div id="root"></div>')
    expect(spy).not.toHaveBeenCalled()
  })

  test('should render without errors', async () => {
    const Root = () => (
      <div>
        <Helmet>
          <title>new title tag</title>
        </Helmet>
      </div>
    )

    const root = Nano.h('div', { id: 'root' }) as HTMLElement
    const title = Nano.h('title', null, 'old title tag') as HTMLElement
    document.head.appendChild(title)
    document.body.appendChild(root)

    await wait()

    expect(nodeToString(document.head)).toBe('<head><title>old title tag</title></head>')

    await wait()

    Nano.render(<Root />, document.getElementById('root'))

    await wait()
    expect(nodeToString(document.head)).toBe('<head><title>new title tag</title></head>')
    expect(spy).not.toHaveBeenCalled()
  })

  describe('<noscript>', () => {
    test('noscript with element', async () => {
      const App = () => (
        <div>
          <Helmet>
            {/* noscript elements */}
            <noscript>
              <link rel="stylesheet" type="text/css" href="foo.css" />
            </noscript>
          </Helmet>
        </div>
      )

      await appendEmptyRootElement()
      await renderComponentToRoot(<App />)

      expect(nodeToString(document.head)).toBe(
        '<head><noscript><link rel="stylesheet" type="text/css" href="foo.css"></noscript></head>'
      )
      expect(spy).not.toHaveBeenCalled()
    })

    test('noscript with string', async () => {
      const App = () => (
        <div>
          <Helmet>
            {/* noscript elements */}
            <noscript>{`
            <link rel="stylesheet" type="text/css" href="foo.css" />
            `}</noscript>
          </Helmet>
        </div>
      )

      await appendEmptyRootElement()
      await renderComponentToRoot(<App />)

      expect(multiLineToSingleLine(nodeToString(document.head.firstChild))).toBe(
        '<noscript><link rel="stylesheet" type="text/css" href="foo.css" /></noscript>'
      )
      expect(spy).not.toHaveBeenCalled()
    })

    test('noscript without helmet', async () => {
      const App = () => (
        <div>
          <noscript>
            <link rel="stylesheet" type="text/css" href="foo.css" />
          </noscript>
        </div>
      )

      await appendEmptyRootElement()
      await renderComponentToRoot(<App />)

      expect(nodeToString(document.body.firstChild?.firstChild)).toBe(
        '<div><noscript><link rel="stylesheet" type="text/css" href="foo.css"></noscript></div>'
      )
      expect(spy).not.toHaveBeenCalled()
    })
  })
})
