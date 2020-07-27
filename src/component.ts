import { onNodeRemove } from './helpers'
import { tick, renderComponent } from './core'

const filterDomElements = (el: any[]) => {
  return el.filter((e: any) => e && e.tagName)
}

export class Component {
  private _elements: HTMLCollection
  private _skipUnmount = false

  constructor(public props: any = {}) {}

  /** Returns all currently rendered node elements */
  public get elements(): HTMLCollection {
    return this._elements
  }

  public set elements(e: HTMLCollection) {
    // if fragment, return first child node
    // @ts-ignore
    if (e.props) e = filterDomElements(e.props.children)
    // @ts-ignore
    if (e.tagName) e = [e]
    this._elements = e
  }

  /** Returns all currently rendered node elements */
  public get elementsAll() {
    if (this.elements.length === 0) console.warn('No Parent Element Found!')
    // @ts-ignore
    return Array.prototype.slice.call(this.elements[0].parentNode.children)
  }

  private _didMount(): any {
    this._onNodeRemoveListener()
  }

  private _onNodeRemoveListener() {
    // check if didUnmount is unused
    if (/^[^{]+{\s+}$/gm.test(this.didUnmount.toString())) return

    // listen if the root elements gets removed
    onNodeRemove(this.elements[0], () => {
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

    // get all current rendered node elements
    const nodeElements = this.elementsAll

    //  get new child elements as array
    const r = this.render(update)
    const rendered = toArray(r)

    // get valid parent node
    const parent = nodeElements[0].parentElement as HTMLElement

    // add all new node elements
    rendered.forEach((r: HTMLElement) => {
      // @ts-ignore
      if (r && r.component) r = renderComponent(r) as HTMLElement
      if (r && r.tagName) parent.insertBefore(r, nodeElements[0])
    })

    // remove all old node elements
    nodeElements.forEach((t: HTMLElement) => {
      parent.removeChild(t)
    })

    // set the newly rendered elements as the new root elements
    this.elements = r as any

    this._onNodeRemoveListener()

    tick(() => (this._skipUnmount = false))
  }
}
