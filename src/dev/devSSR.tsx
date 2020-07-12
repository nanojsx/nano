import Nano, { Img, Helmet } from '../index'
import { Fragment } from '../fragment'

const AnotherChild = () => {
  return (
    <Fragment>
      <Helmet>
        <style>
          {`
              .should-be-in-head {
                yes: please;
              }
            `}
        </style>
      </Helmet>
    </Fragment>
  )
}

const Child = () => {
  return (
    <div>
      <h1>SSR</h1>
      <Helmet>
        <style>
          {`{
          .helo {
            color:red;
          }}`}
        </style>
      </Helmet>
    </div>
  )
}

const App = () => {
  return (
    <div>
      <Helmet>
        <title>some title</title>
        <meta name="description" content="Nano-JSX application" />
        <style>
          {`thj
          is
          on mublitp
          line`}
        </style>
      </Helmet>
      <AnotherChild />
      <Img href="some-url" placeholder="placeholder-url" />
      <Helmet footer>
        <title>some title</title>
        <meta name="description" content="Nano-JSX application" />
      </Helmet>
      <div>
        <Child />
      </div>
    </div>
  )
}

const app = Nano.renderSSR(<App />)
const { body, head, footer } = Helmet.SSR(app)

const html = `
<!DOCTYPE html>
<html lang="en">
  <head>
    ${head.join('\n')}
  </head>
  <body>
    ${body}
  </body>
  ${footer.join('\n')}
</html>
`

console.log('html', html)
