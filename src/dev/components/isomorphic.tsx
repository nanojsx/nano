import * as Nano from '../../core'
import { Component } from '../../component'

/**
 * This Component work on the client and the server.
 * (Make your you prefetch the static getData() and pass it as "data" props in SSR)
 */

// simply mocks a server fetch and returns an array of comments
const fetchMock = (): Promise<string[]> =>
  new Promise(resolve => setTimeout(() => resolve(['comment_one', 'comment_two']), 500))

// the comments component
interface CommentsProps {
  comments: string[]
}
const Comments: Nano.FC<CommentsProps> = ({ comments }) => {
  console.log(comments)
  return (
    <ul>
      {comments.map(d => (
        <li>{d}</li>
      ))}
    </ul>
  )
}

// const Bla = () => {
//   console.log('BLA')
//   return <div>asdf</div>
// }

// the app component
class App extends Component {
  // this static method can be calles before the componend is rendered in SSR mode
  static async getData() {
    // get some data from your server
    return await fetchMock()
  }

  async didMount() {
    // will re-render the component and pass the result of getData()
    const data = await App.getData()
    this.update(data)
  }

  render(data: string[]) {
    // this.props.data will be defined if in SSR mode
    data = data || this.props.data

    // console.log(Nano.h(Bla, null))
    if (data) return <Comments comments={data} />
    // <Comments comments={data} />
    // this will be shown while loading on the client side
    else return <div>loading...</div>
  }
}

export { App }
