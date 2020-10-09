import * as Nano from '../core'
import { Component } from '../component'

class App extends Component {
  render() {
    return <div>Nano JSX App</div>
  }
}

Nano.render(<App />, document.getElementById('root'))
