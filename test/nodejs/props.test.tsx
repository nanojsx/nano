import Nano, { Component } from '../../lib/index.js'
import { wait } from './helpers.js'

const spy = jest.spyOn(global.console, 'error')

test('should render without errors', async () => {
  const SingleName = (props: any) => {
    return <li>{`${props.name} - ${props.children}`}</li>
  }

  const NameList = (props: any) => {
    const list = props.names.map((name: string) => <SingleName name={name}>{name}</SingleName>)
    return <ul>{list}</ul>
  }

  const Root = (props: any) => {
    return (
      <div id="name-list">
        <h1>List of all names:</h1>
        <NameList {...props} />
      </div>
    )
  }
  const res = Nano.render(<Root names={['Doe', 'Suzanne']} />)

  await wait()

  expect(res.outerHTML).toBe(
    '<div id="name-list"><h1>List of all names:</h1><ul><li>Doe - Doe</li><li>Suzanne - Suzanne</li></ul></div>'
  )
  expect(spy).not.toHaveBeenCalled()
})
