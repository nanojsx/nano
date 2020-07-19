import { onNodeRemove } from './helpers'

export class Component {
  public props: any
  public element: any
  private _skipUnmount = false

  private _didMount(): any {
    this._onNodeRemoveListener(this.element)
  }

  private _onNodeRemoveListener(element: any) {
    // if fragment, return first child
    if (element.props) element = element.props.children[0]

    // check if didUnmount is unused
    if (/^[^{]+{\s+}$/gm.test(this.didUnmount.toString())) return

    // listen if the root element gets removed
    onNodeRemove(element, () => {
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

    // set the newly rendered element as the new root element
    this.element = r

    this._onNodeRemoveListener(this.element)

    setTimeout(() => (this._skipUnmount = false), 0)
  }
}
