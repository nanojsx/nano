import { h, render } from '../core'
import { Component } from '../component'

class App extends Component {
  render() {
    return <div>Nano JSX App</div>
  }
}

render(<App />, document.getElementById('root'))
