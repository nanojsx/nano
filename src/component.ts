import { removeAllChildNodes, appendChildren, Empty } from './core'

export class Component {
  element: HTMLElement
  props: any

  render(update?: any): HTMLElement | void {}

  /** Will forceRender the component */
  update(update?: any) {
    // @ts-ignore // Well, this is kind of needed for fragments to work
    this.element = this.element.props?.children[0] ?? this.element

    // get parent
    const parent = this.element.parentElement as HTMLElement

    // remove component root
    removeAllChildNodes(parent)

    // render component root
    this.element = this.render(update) as any

    // append new component root
    appendChildren(parent, this.element)
  }
}
