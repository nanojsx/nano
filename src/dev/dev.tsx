import { h, render } from '../core'
import { Component } from '../component'
import { useState } from '../hooks'

const ClickMe = () => {
  const id = 'some-id'
  const [counter, setCounter, getState, counterEffect] = useState(1, id)

  let output: HTMLParagraphElement

  counterEffect(state => {
    output.innerText = state.toString()
  })

  return (
    <div>
      <button
        onClick={() => {
          setCounter(getState(id) + 1)
        }}
      >
        click me
      </button>
      <p
        ref={(el: HTMLParagraphElement) => {
          output = el
        }}
      >
        {counter}
      </p>
    </div>
  )
}

class Clicks extends Component {
  constructor(props: any) {
    super(props)

    this.initState = { counter: 1 }
  }

  render() {
    return (
      <div>
        <button onClick={() => this.setState({ ...this.state, counter: this.state.counter + 1 }, true)}>
          click me
        </button>
        <p>{this.state.counter}</p>
      </div>
    )
  }
}

class App extends Component {
  public didMount() {
    setInterval(() => {
      this.update()
    }, 2000)
  }

  render() {
    return (
      <div style="padding: 16px;">
        <h3>Class Component</h3>
        <Clicks />
        <hr />
        <h3>Functional Component</h3>
        <ClickMe />
      </div>
    )
  }
}

render(<App />, document.getElementById('root'))
