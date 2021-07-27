import Nano, { Img } from '../../lib/index.js'
import { wait, mockIntersectionObserver } from '../helpers.js'
import { nodeToString } from '../../lib/helpers.js'
import { _clearState } from '../../lib/state.js'

const spy = jest.spyOn(global.console, 'error')
const img = 'https://nanojsx.github.io/img/logo.svg'

const Placeholder = () => <p>PLACEHOLDER</p>

mockIntersectionObserver()

afterEach(async () => {
  // clear state
  _clearState()
})

test('should render Img Component', async () => {
  const App = () => {
    return (
      <div>
        <Img
          ref={(c: any) => {
            // console.log(c.elements) // [div]
            setTimeout(() => {
              // console.log(c.elements) // [img]
              c.state.image.dispatchEvent(new Event('load')) // manually invoke load (for testing)
            }, 500)
          }}
          width="250"
          height="250"
          src={img}
        />
      </div>
    )
  }

  const res = Nano.render(() => <App />)

  await wait(100)
  expect(nodeToString(res)).toBe('<div><div style="width:250px;height:250px;"></div></div>')

  await wait(500)
  expect(nodeToString(res)).toBe(
    '<div><img width="250" height="250" src="https://nanojsx.github.io/img/logo.svg"></div>'
  )

  expect(spy).not.toHaveBeenCalled()
})

test('should render Img Component with Placeholder', async () => {
  const App = () => {
    return (
      <div>
        <Img
          ref={(c: any) => {
            // console.log(c.elements) // [p]
            setTimeout(() => {
              // console.log(c.elements) // [img]
              c.state.image.dispatchEvent(new Event('load')) // manually invoke load (for testing)
            }, 500)
          }}
          src={img}
          placeholder={Placeholder}
        />
      </div>
    )
  }

  const res = Nano.render(() => <App />)

  await wait(100)
  expect(nodeToString(res)).toBe('<div><p>PLACEHOLDER</p></div>')

  await wait(500)
  expect(nodeToString(res)).toBe('<div><img src="https://nanojsx.github.io/img/logo.svg"></div>')

  expect(spy).not.toHaveBeenCalled()
})

test('should render Img Component (not lazy loaded)', async () => {
  const App = () => {
    return (
      <div>
        <Img lazy={false} src={img} placeholder={Placeholder} />
      </div>
    )
  }

  const res = Nano.render(() => <App />)

  await wait(100)
  expect(nodeToString(res)).toBe('<div><img src="https://nanojsx.github.io/img/logo.svg"></div>')

  await wait(500)
  expect(nodeToString(res)).toBe('<div><img src="https://nanojsx.github.io/img/logo.svg"></div>')

  expect(spy).not.toHaveBeenCalled()
})
