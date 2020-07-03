import { removeAllChildNodes, appendChildren, Empty } from './core'

export class Component {
  element: any
  props: any

  willMount(): any {}
  didMount(): any {}

  render(update?: any): HTMLElement | void {}

  /** Will forceRender the component */
  update(update?: any) {
    const toArray = (el: any) => {
      if (el.props) return el.props.children
      if (!Array.isArray(el)) return [el]
      else return el
    }

    // get old child elements as array
    const tmpElement = toArray(this.element)

    //  get new child elements as array
    const r = this.render(update)
    const rendered = toArray(r)

    // get parent node
    const parent = tmpElement[0].parentElement as HTMLElement

    // add all new element
    rendered.forEach((r: HTMLElement) => {
      parent.insertBefore(r, tmpElement[0])
    })

    // remove all old element
    tmpElement.forEach((t: HTMLElement) => {
      parent.removeChild(t)
    })

    // set the newly rendered element as the new root elemen
    this.element = r
  }
}
