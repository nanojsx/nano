export class Component {
  element: HTMLElement
  props: any

  render(): HTMLElement | void {}

  /** Will forceRender the component */
  update() {
    if (!this.element) {
      console.warn('"this.element" is not yet defined in update()')
      return
    }

    // get parent
    const parent = this.element.parentElement
    if (!parent) {
      console.warn('"this.element.parentElement" is not yet defined in update()')
      return
    }

    // remove component root
    parent.removeChild(this.element)

    // render component root
    let element = this.render() as HTMLElement

    // if it is a fragment, element will be an array
    if (Array.isArray(element)) element = element[0]

    // set new component root element
    this.element = element

    // append new component root
    parent.appendChild(this.element)
  }
}
