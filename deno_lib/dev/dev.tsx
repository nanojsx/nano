import * as Nano from '../core.ts'
import { Component } from '../component.ts'

class App extends Component {
  render() {
    return <div>Nano JSX App</div>
  }
}

Nano.render(<App />, document.getElementById('root'))
