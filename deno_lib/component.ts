import { onNodeRemove } from './helpers.ts'
import { tick, _render, render, h, FC } from './core.ts'
import { _state } from './state.ts'

export class Component<P extends Object = any, S = any> {
  public props: P
  public id: string
  private _elements: HTMLElement[] = []
  private _skipUnmount = false
  private _hasUnmounted = false

  constructor(props: P) {
    this.props = props || {}
    this.id = this._getHash()
  }

  public static get isClass() {
    return true
  }

  public get isClass() {
    return true
  }

  setState(state: S, shouldUpdate: boolean = false) {
    const isObject = typeof state === 'object' && state !== null

    // if state is an object, we merge the objects
    if (isObject && this.state !== undefined) this.state = { ...this.state, ...state }
    // else, we just overwrite it
    else this.state = state

    if (shouldUpdate) this.update()
  }

  set state(state: S) {
    _state.set(this.id, state)
  }

  get state() {
    return _state.get(this.id) as S
  }

  set initState(state: S) {
    if (this.state === undefined) this.state = state
  }

  /** Returns all currently rendered node elements */
  public get elements(): HTMLElement[] {
    return this._elements || []
  }

  public set elements(elements: HTMLElement[]) {
    if (!Array.isArray(elements)) elements = [elements]

    elements.forEach(element => {
      this._elements.push(element)
    })
  }

  private _addNodeRemoveListener() {
    // check if didUnmount is unused
    if (/^[^{]+{\s+}$/gm.test(this.didUnmount.toString())) return

    // listen if the root elements gets removed
    onNodeRemove(this.elements[0], () => {
      if (!this._skipUnmount) this._didUnmount()
    })
  }

  // @ts-ignore
  private _didMount(): any {
    this._addNodeRemoveListener()
    this.didMount()
  }

  private _willUpdate(): any {
    this.willUpdate()
  }

  private _didUpdate(): any {
    this.didUpdate()
  }

  private _didUnmount(): any {
    if (this._hasUnmounted) return
    this.didUnmount()
    this._hasUnmounted = true
  }

  public willMount(): any {}
  public didMount(): any {}
  public willUpdate(): any {}
  public didUpdate(): any {}
  public didUnmount(): any {}

  public render(_update?: any): HTMLElement | void {}

  /** Will forceRender the component */
  public update(update?: any) {
    this._skipUnmount = true
    this._willUpdate()
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
    const parent = oldElements[0].parentNode

    // make sure we have a parent
    if (!parent) console.warn('Component needs a parent element to get updated!')

    // add all new node elements
    this.elements.forEach((child: HTMLElement) => {
      if (parent) parent.insertBefore(child, oldElements[0])
    })

    // remove all elements
    oldElements.forEach((child: HTMLElement) => {
      // wee keep the element if it is the same, for example if passed as a child
      if (!this.elements.includes(child)) {
        child.remove()
        // @ts-ignore
        child = null
      }
    })

    // listen for node removal
    this._addNodeRemoveListener()

    // @ts-ignore
    tick(() => {
      this._skipUnmount = false
      if (!this.elements[0].isConnected) this._didUnmount()
      else this._didUpdate()
    })
  }

  private _getHash(): any {}
}

/**
 * Renders a class component and returns its reference.
 * 
 * @param C Class Component
 * @param props Properties
 * @param children Children
 * @param parent HTMLElement
 * @returns Reference to Class Component
 * 
 * @example
  const componentReference = await renderComponentGetReference(
      App, // Component
      { name: 'Joe' }, // Props
      [Child, 'Some text', child], // Children (Component, string, FC)
      parentElement // HTMLElement
  )
      
  componentReference.hello()
  componentReference.setState({ age: 40 })
  componentReference.update()
  parentElement.remove()
 */
export function renderComponentGetReference<T extends Component>(
  C: { new (props: any): T },
  props: any,
  children: Array<typeof Component | FC | string>,
  parent: HTMLElement
): Promise<T> {
  return new Promise(resolve => {
    render(h(C, { ...props, ref: (el: any) => resolve(el) }, ...children), parent)
    // This is the same as the above, but written in JSX.
    // render(<C {...props} ref={(el: any) => resolve(el)} />, parent)
  })
}
