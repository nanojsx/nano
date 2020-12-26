import { onNodeRemove } from './helpers'
import { tick, _render } from './core'
import { _state } from './state'

export class Component<P extends Object = any, S = any> {
  public id: string
  private _elements: HTMLElement[] = []
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
  public get elements(): HTMLElement[] {
    return this._elements
  }

  public set elements(elements: HTMLElement[]) {
    if (!Array.isArray(elements)) elements = [elements]

    elements.forEach((element) => {
      this._elements.push(element)
    })
  }

  protected _didMount(): any {
    this._addNodeRemoveListener()
    this.didMount()
  }

  private _addNodeRemoveListener() {
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
    const oldElements = [...this.elements]

    // clear
    this._elements = []

    let el = this.render(update)
    el = _render(el)
    this.elements = el as any

    // console.log('old: ', oldElements)
    // console.log('new: ', this.elements)

    // get valid parent node
    const parent = oldElements[0].parentElement as HTMLElement

    // make sure we have a parent
    if (!parent) console.warn('Component needs a parent element to get updated!')

    // add all new node elements
    this.elements.forEach((r: HTMLElement) => {
      parent.insertBefore(r, oldElements[0])
    })

    // remove all elements
    oldElements.forEach((t: HTMLElement) => {
      parent.removeChild(t)
    })

    tick(() => {
      this._skipUnmount = false
      oldElements.forEach((_e: any) => {
        _e = undefined
      })
    })
  }

  private _getHash(): any {}
}
