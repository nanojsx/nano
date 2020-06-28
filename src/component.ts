import { removeAllChildNodes, appendChildren, Empty } from './core'

export class Component {
  element: HTMLElement
  props: any

  render(update?: any): HTMLElement | void {}

  /** Will forceRender the component */
  update(update?: any) {
    // @ts-ignore // Well, this is kind of needed for fragments to work
    this.element = !!this.element?.props ? this.element.props?.children[0] : this.element

    // on fragments we choose the first child
    let el = Array.isArray(this.element) ? this.element[0] : this.element

    // nothing to render
    if (!el) return Empty

    el = !!el.props ? el.props?.children[0] : el

    if (!el) {
      // console.warn('"this.element" is not defined in update()')
      return
    }

    // get parent
    const parent = el.parentElement
    if (!parent) {
      // console.warn('"this.element.parentElement" is not defined in update()')
      // el.replaceWith(this.render(update) as any)
      return
    }

    // remove component root
    removeAllChildNodes(parent)

    // render component root
    let res = this.render(update) as any

    // let element = !!res.props ? res.props?.children : res

    // if it is a fragment, element will be an array
    //if (Array.isArray(element)) element = element[0]

    // set new component root element
    this.element = res

    // append new component root
    appendChildren(parent, this.element)
  }
}
