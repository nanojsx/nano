import { removeAllChildNodes, appendChildren } from '../core'
import { Component } from '../component'
import { nodeToString } from '../helpers'

export class Visible extends Component {
  isVisible = false

  willMount() {
    const child = this.props.children[0] as HTMLElement
    this.element = child.cloneNode(false) as HTMLElement
    this.element.setAttribute('visibility', 'hidden')
    removeAllChildNodes(this.element)
  }

  didMount() {
    const observer = new IntersectionObserver(
      (entries, observer) => {
        entries.forEach((entry) => {
          if (entry.isIntersecting) {
            observer.disconnect()
            this.isVisible = true
            this.render()
          }
        })
      },
      { threshold: 0 }
    )
    observer.observe(this.element)
  }

  render() {
    if (this.props.children.length !== 1) console.warn('Please add ONE child to <Visible> (<Visible>child</Visible>)')

    if (this.isVisible) {
      const children = this.props.children as HTMLElement[]
      this.element.removeAttribute('visibility')
      appendChildren(this.element, children)
      this.element
    } else return this.element
  }
}
