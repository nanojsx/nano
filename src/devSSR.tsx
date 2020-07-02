import Nano, { Img, Helmet } from './index'

const App = () => {
  return (
    <div>
      <Helmet>
        <title>some title</title>
        <meta name="description" content="Nano-JSX application" />
      </Helmet>
      <Img href="some-url" placeholder="placeholder-url" />
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
console.log('html', html)
