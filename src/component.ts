export class Component {
  element: HTMLElement
  props: any

  render(update?: any): HTMLElement | void {}

  /** Will forceRender the component */
  update(update?: any) {
    // on fragments we choose the first child
    const el = Array.isArray(this.element) ? this.element[0] : this.element

    if (!el) {
      console.warn('"this.element" is not yet defined in update()')
      return
    }

    // get parent
    const parent = el.parentElement
    if (!parent) {
      console.warn('"this.element.parentElement" is not yet defined in update()')
      return
    }

    // remove component root
    parent.removeChild(el)

    // render component root
    let element = this.render(update) as HTMLElement

    // if it is a fragment, element will be an array
    if (Array.isArray(element)) element = element[0]

    // set new component root element
    this.element = element

    // append new component root
    parent.appendChild(this.element)
  }
}
