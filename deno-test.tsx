import * as Nano from './mod.ts'
import { Component, renderSSR } from './mod.ts'

class Hello extends Component {
  render() {
    return <p>lorem ipsum</p>
  }
}

const App = () => {
  return (
    <div>
      <h1>Hello World!</h1>
      <Hello />
    </div>
  )
}

console.log(renderSSR(<App />))
