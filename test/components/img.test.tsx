import Nano, { Img } from '../../lib/cjs/index.js'
import { wait, mockIntersectionObserver } from '../helpers.js'
import { nodeToString } from '../../lib/cjs/helpers.js'

const spy = jest.spyOn(global.console, 'error')

mockIntersectionObserver()

test('should render without errors', async (done) => {
  const App = () => {
    return (
      <div>
        <Img
          ref={(el: HTMLElement) => {
            setTimeout(() => {
              el.dispatchEvent(new Event('load'))
            })
          }}
          src="https://via.placeholder.com/250"
          placeholder="https://via.placeholder.com/150"
        />
      </div>
    )
  }

  const res = Nano.render(<App />)

  await wait(50)
  expect(nodeToString(res)).toBe('<div><img src="https://via.placeholder.com/150"></div>')

  await wait(200)
  expect(nodeToString(res)).toBe('<div><img src="https://via.placeholder.com/250"></div>')
  expect(spy).not.toHaveBeenCalled()
  done()
})

test('should render without errors', async (done) => {
  const Placeholder = () => {
    return <p>PLACEHOLDER</p>
  }

  const App = () => {
    return (
      <div>
        <Img
          ref={(el: HTMLElement) => {
            setTimeout(() => {
              el.dispatchEvent(new Event('load'))
            })
          }}
          src="https://via.placeholder.com/250"
          placeholder={Placeholder}
        />
      </div>
    )
  }

  const res = Nano.render(<App />)

  await wait(50)
  expect(nodeToString(res)).toBe('<div><p>PLACEHOLDER</p></div>')

  await wait(200)
  expect(nodeToString(res)).toBe('<div><img src="https://via.placeholder.com/250"></div>')
  expect(spy).not.toHaveBeenCalled()
  done()
})

test('should render without errors', async (done) => {
  const Placeholder = () => {
    return <p>PLACEHOLDER</p>
  }

  const App = () => {
    return (
      <div>
        <Img
          ref={(el: HTMLElement) => {
            setTimeout(() => {
              el.dispatchEvent(new Event('load'))
            })
          }}
          width="250"
          height="250"
          src="https://via.placeholder.com/250"
        />
      </div>
    )
  }

  const res = Nano.render(<App />)

  await wait(50)
  expect(nodeToString(res)).toBe('<div><div style="width:250px;height:250px;" width="250" height="250"></div></div>')

  await wait(200)
  expect(nodeToString(res)).toBe('<div><img width="250" height="250" src="https://via.placeholder.com/250"></div>')
  expect(spy).not.toHaveBeenCalled()
  done()
})
