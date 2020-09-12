/**
 * @jest-environment node
 */

import Nano, { Img, Helmet } from '../lib/index.js'

const spy = jest.spyOn(global.console, 'error')

test('should render without errors', async (done) => {
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
  done()
})
