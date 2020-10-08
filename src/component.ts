import { onNodeRemove } from './helpers'
import { tick, renderComponent } from './core'
import { _state } from './state'

const filterDomElements = (el: any[]) => {
  return el.filter((e: any) => e && e.tagName)
}

export class Component<P = any, S = any> {
  private _state: any = undefined
  private _elements: HTMLCollection
  private _skipUnmount = false
  private _id: string

  constructor(public props: P, id: string) {
    this._id = id.toString()
  }

  set id(id: string) {
    this._id = id.toString()
  }

  get id() {
    return this._id
  }

  setState(state: S, shouldUpdate: boolean = false) {
    this._state = state
    if (this._id) _state.set(this._id, state)
    if (shouldUpdate) this.update()
  }

  set state(state: S) {
    if (!this._id) {
      console.warn('Please set an id before using state')
      return
    }

    if (!_state.has(this._id)) this.setState(state)
  }

  get state() {
    if (this._id) return _state.get(this._id) as S
    else return this._state as S
  }

  /** Returns all currently rendered node elements */
  public get elements(): HTMLCollection {
    return this._elements
  }

  public set elements(e: HTMLCollection) {
    // if the component has nothing to render
    if (!e) return

    // if fragment, return first child node
    // @ts-ignore
    if (e.props) e = filterDomElements(e.props.children)

    // @ts-ignore
    if (e.tagName) e = [e]

    this._elements = e
  }

  /** Returns all currently rendered node elements */
  public get elementsArray() {
    if (this.elements.length === 0) console.warn('No Parent Element Found!')
    // @ts-ignore
    return Array.prototype.slice.call(this.elements)
  }

  // @ts-ignore
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

  // @ts-ignore
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
    const nodeElements = this.elementsArray

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

    // remove all elements
    nodeElements.forEach((t: HTMLElement) => {
      parent.removeChild(t)
    })

    // set the newly rendered elements as the new root elements
    this.elements = r as any

    this._onNodeRemoveListener()

    tick(() => (this._skipUnmount = false))
  }
}
