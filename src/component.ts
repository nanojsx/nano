import { onNodeRemove } from './helpers'
import { tick, render } from './core'
import { _state } from './state'

const filterDomElements = (el: any[]) => el.filter((e: any) => e && e.tagName)

export class Component<P extends Object = any, S = any> {
  public id: string
  private _elements: HTMLCollection
  private _skipUnmount = false

  constructor(public props: P) {
    this.id = this._getHash()
  }

  setState(state: S, shouldUpdate: boolean = false) {
    _state.set(this.id, state)
    if (shouldUpdate) this.update()
  }

  set state(state: S) {
    if (!_state.has(this.id)) this.setState(state)
  }

  get state() {
    return _state.get(this.id) as S
  }

  /** Returns all currently rendered node elements */
  public get elements(): HTMLCollection {
    return this._elements
  }

  public set elements(e: HTMLCollection) {
    // if the component has nothing to render
    if (!e) return

    // if fragment, return first child node
    // @ts-expect-error
    if (e.props) e = filterDomElements(e.props.children)

    // @ts-expect-error
    if (e.tagName) e = [e]

    this._elements = e
  }

  /** Returns all currently rendered node elements */
  public get elementsArray() {
    if (this.elements.length === 0) console.warn('No Parent Element Found!')
    return Array.prototype.slice.call(this.elements)
  }

  protected _didMount(): any {
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

  public render(_update?: any): HTMLElement | void {}

  /** Will forceRender the component */
  public update(update?: any) {
    this._skipUnmount = true

    // get all current rendered node elements
    const nodeElements = this.elementsArray

    //  get new child elements as array
    let rendered = render(this.render(update))

    // to array
    const renderedArray = Array.isArray(rendered) ? rendered : [rendered]

    // get valid parent node
    const parent = nodeElements[0].parentElement as HTMLElement

    // add all new node elements
    renderedArray.forEach((r: HTMLElement) => {
      if (r.tagName) parent.insertBefore(r, nodeElements[0])
    })

    // remove all elements
    nodeElements.forEach((t: HTMLElement) => {
      parent.removeChild(t)
    })

    // set the newly rendered elements as the new root elements
    this.elements = rendered as any

    this._onNodeRemoveListener()

    tick(() => (this._skipUnmount = false))
  }

  private _getHash(): any {}
}
