import Nano, { Helmet } from '../../lib/index.js'
import { wait, nodeToString } from '../helpers.js'

const spy = jest.spyOn(global.console, 'error')

afterEach(async () => {
  // reset jsdom document
  document.body.innerHTML = ''
  document.head.innerHTML = ''
  await wait()
})

test('should render without errors', async (done) => {
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
  expect(document.head.innerHTML).toBe(
    '<meta name="description" content="Nano-JSX application"><title>My Plain Title or dynamic title</title><link rel="canonical" href="http://mysite.com/example">'
  )
  expect(document.body.innerHTML).toBe('<div id="root"></div>')
  expect(spy).not.toHaveBeenCalled()
  done()
})

test('should render without errors', async (done) => {
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
  done()
})
