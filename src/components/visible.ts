import { h, removeAllChildNodes, appendChildren } from '../core'
import { Component } from '../component'
import { nodeToString } from '../helpers'

export class Visible extends Component {
  isVisible = false

  didMount() {
    const observer = new IntersectionObserver(
      (entries, observer) => {
        entries.forEach((entry) => {
          if (entry.isIntersecting) {
            observer.disconnect()
            this.isVisible = true
            this.update()
          }
        })
      },
      { threshold: [0, 1] }
    )
    observer.observe(this.element)
  }

  render() {
    if (!this.isVisible) {
      return h('div', { 'data-visible': false, visibility: 'hidden' })
    } else {
      if (this.props.onVisible) this.props.onVisible()
      return this.props.children
    }
  }
}
