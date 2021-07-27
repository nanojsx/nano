import Nano, { Component } from '../lib/index.js'
import { wait, nodeToString, mockIntersectionObserver } from './helpers.js'
import { Fragment } from '../lib/fragment.js'
import { hydrateLazy } from '../lib/lazy.js'

const spy = jest.spyOn(global.console, 'error')

mockIntersectionObserver()

afterEach(async () => {
  // reset jsdom document
  document.body.innerHTML = ''
  document.head.innerHTML = ''
  await wait(200)
})

test('should render without errors', async () => {
  class Ads extends Component {
    render() {
      return <div>Ads</div>
    }
  }

  const App = () => {
    return (
      <Fragment>
        <h2>Comment Section</h2>
        <p>Comment 1</p>
        <p>Comment 2</p>
        <Ads />
        <p>Comment 3</p>
      </Fragment>
    )
  }

  const res = hydrateLazy(<App />, document.body)

  expect(nodeToString(res)).toBe('<body><div data-visible="false" visibility="hidden"></div></body>')

  await wait(250)

  expect(nodeToString(res)).toBe(
    '<body><h2>Comment Section</h2><p>Comment 1</p><p>Comment 2</p><div>Ads</div><p>Comment 3</p></body>'
  )

  expect(spy).not.toHaveBeenCalled()
})
