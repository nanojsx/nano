/**
 * @jest-environment node
 */

import Nano, { Helmet, Fragment } from '../../../lib/index.js'
import { initSSR } from '../../../lib/ssr.js'

const spy = jest.spyOn(global.console, 'error')

initSSR()

const getHeadFromApp = (Content: any) => {
  const App = () => (
    <div>
      <Helmet>
        <Content />
      </Helmet>
    </div>
  )
  const app = Nano.renderSSR(<App />)
  const helmet = Helmet.SSR(app)
  return helmet
}

describe('<Helmet> Node.js', () => {
  test('application/ld+json', async () => {
    const { head } = getHeadFromApp(
      <script type="application/ld+json">{`
    {
      "@context": "https://schema.org/",
      "@type": "Recipe",
      "name": "Party Coffee Cake",
      "author": {
        "@type": "Person",
        "name": "Mary Stone"
      },
      "datePublished": "2018-03-10",
      "description": "This coffee cake is awesome and perfect for parties.",
      "prepTime": "PT20M"
    }
  `}</script>
    )

    expect(head[0]).toContain('<script type="application/ld+json">')
    expect(head[0]).toContain('"@context": "https://schema.org/"')
    expect(spy).not.toHaveBeenCalled()
  })

  test('<style>', async () => {
    const { head } = getHeadFromApp(
      <style>{`
    @import url("https://fonts.googleapis.com/css?family=Montserrat:400,700|Roboto:100,300,400");

    body {
      font-family: 'Montserrat', 'Roboto', sans-serif;
    }
  `}</style>
    )

    expect(head[0]).toContain(
      '@import url("https://fonts.googleapis.com/css?family=Montserrat:400,700|Roboto:100,300,400"'
    )
    expect(head[0]).toContain('<style>')
    expect(head[0]).toContain("'Montserrat', 'Roboto', sans-serif;")
    expect(spy).not.toHaveBeenCalled()
  })

  test('<noscript>', async () => {
    const { head } = getHeadFromApp(<noscript>{'<link rel="stylesheet" type="text/css" href="foo.css" />'}</noscript>)

    expect(head[0]).toContain('<noscript><link rel="stylesheet" type="text/css" href="foo.css" /></noscript>')
    expect(spy).not.toHaveBeenCalled()
  })

  test('html and body attributes', async () => {
    const { attributes } = getHeadFromApp(
      <Fragment>
        <html lang="en" amp />
        <body class="body-class" />
      </Fragment>
    )

    expect(attributes.html.toString()).toBe('lang="en" amp="true"')
    expect(attributes.body.toString()).toBe('class="body-class"')
    expect(spy).not.toHaveBeenCalled()
  })
})
