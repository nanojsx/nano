import * as Nano from '../core'
import { Component } from '../component'
import { defineAsCustomElements } from '../customElementsMode'

class App extends Component {
  styles = {
    margin: '2em',
    padding: '1em',
    background: 'antiquewhite'
  }

  constructor(props: any) {
    super(props)
    this.props = { ...this.props, counter: 0 }
    console.log('constructor')
  }

  willMount() {
    console.log('will Mount')
  }

  didUnmount() {
    console.log('did Unmount')
  }
  didMount() {
    console.log('did Mount')
  }

  render() {
    console.log('render')
    return (
      <div
        onClick={() => {
          this.props.counter++
          this.update()
        }}
        style={{ ...this.styles }}>
        Click me {this.props.counter}
        <b> {this.props.children}</b>
      </div>
    )
  }
}

defineAsCustomElements(App, 'first-app', ['counter', 'children'])
