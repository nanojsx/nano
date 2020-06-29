import Nano, { Helmet } from '../../lib/index.js'
import { wait } from '../helpers.js'

const spy = jest.spyOn(global.console, 'error')

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
      </Helmet>
    </div>
  )

  const root = Nano.createElement('div', { id: 'root' }) as HTMLElement
  document.body.appendChild(root)

  Nano.render(<Root />, document.getElementById('root'))

  await wait()
  expect(document.getElementsByTagName('HTML')[0].getAttribute('lang')).toBe('en')
  expect(document.head.innerHTML).toBe('<title></title><meta name="description" content="Nano-JSX application">')
  expect(document.body.innerHTML).toBe('<div id="root"></div>')
  expect(spy).not.toHaveBeenCalled()
  done()
})
