import * as Nano from './mod.ts'
import { Component, renderSSR, Helmet } from './mod.ts'

class Hello extends Component {
  render() {
    return <p>lorem ipsum</p>
  }
}

const App = () => {
  return (
    <div>
      <Helmet>
        <title>Nano JSX SSR</title>
      </Helmet>
      <h1>Hello World!</h1>
      <Hello />
    </div>
  )
}

const app = renderSSR(<App />)
const { body, head, footer } = Helmet.SSR(app)

console.log('body', body)
console.log('head', head)
console.log('footer', footer)
