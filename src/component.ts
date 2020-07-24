import { onNodeRemove } from './helpers'
import { tick, renderComponent } from './core'

const filterDomElements = (el: any[]) => {
  const nodeElements = el.filter((e: any) => {
    return e.tagName
  })
  return nodeElements
}

export class Component {
  public props: any
  public element: any
  private _skipUnmount = false

  private _didMount(): any {
    this._onNodeRemoveListener(this.element)
  }

  private _onNodeRemoveListener(element: any) {
    // check if didUnmount is unused
    if (/^[^{]+{\s+}$/gm.test(this.didUnmount.toString())) return

    // if fragment, return first child node
    if (element.props) element = filterDomElements(element.props.children)[0]

    // listen if the root element gets removed
    onNodeRemove(this.element, () => {
      if (!this._skipUnmount) this.didUnmount()
    })
  }

  public willMount(): any {}
  public didMount(): any {}
  public didUnmount(): any {}

  public render(update?: any): HTMLElement | void {}

  /** Will forceRender the component */
  public update(update?: any) {
    this._skipUnmount = true

    const toArray = (el: any) => {
      if (el.props) return el.props.children
      if (!Array.isArray(el)) return [el]
      else return el
    }

    // get old child node elements as array
    const nodeElements = filterDomElements(toArray(this.element))

    //  get new child elements as array
    const r = this.render(update)
    const rendered = toArray(r)

    // get valid parent node
    const parent = nodeElements[0].parentElement as HTMLElement

    // add all new node elements
    rendered.forEach((r: HTMLElement) => {
      // @ts-ignore
      if (r.component) r = renderComponent(r) as HTMLElement
      parent.insertBefore(r, nodeElements[0])
    })

    // remove all old node elements
    nodeElements.forEach((t: HTMLElement) => {
      parent.removeChild(t)
    })

    // set the newly rendered element as the new root element
    this.element = r

    this._onNodeRemoveListener(this.element)

    tick(() => (this._skipUnmount = false))
  }
}
