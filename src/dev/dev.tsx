import { h, render } from '../core.js'
import { Component } from '../component.js'

class App extends Component {
  render() {
    return <div>Nano JSX App</div>
  }
}

render(<App />, document.getElementById('root'))
