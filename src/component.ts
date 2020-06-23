export class Component {
  element: HTMLElement
  props: any
  // parent: HTMLElement
  // willMount() {}

  // didMount() {}

  render(): HTMLElement | void {}

  /** Will forceRender the component */
  update() {
    // get parent
    const parent = this.element?.parentElement
    if (!parent) return

    // remove component root
    parent.removeChild(this.element)

    // render component root
    const element = this.render() as HTMLElement

    // set new component root element
    this.element = element

    // append new component root
    parent.appendChild(this.element)
  }
}
