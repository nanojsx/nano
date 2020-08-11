import { Component } from '../component.ts'
import { h } from '../core.ts'

export class Img extends Component {
  isLoaded = false
  image: HTMLImageElement

  didMount() {
    const { placeholder, children, ...rest } = this.props

    const observer = new IntersectionObserver(
      (entries, observer) => {
        entries.forEach((entry) => {
          if (entry.isIntersecting) {
            observer.disconnect()
            this.image = h('img', { ...rest }) as HTMLImageElement
            this.image.onload = () => {
              this.isLoaded = true
              this.update()
            }
          }
        })
      },
      { threshold: [0, 1] }
    )
    observer.observe(this.elements[0])
  }
  render() {
    const { src, placeholder, children, lazy = true, ...rest } = this.props

    // return the img tag if not lazy loaded
    if (typeof lazy === 'boolean' && lazy === false) return h('img', { src, ...rest }) as HTMLImageElement

    // if it is visible and loaded, show the image
    if (this.isLoaded) {
      return this.image
      // if the placeholder is an image src
    } else if (placeholder && typeof placeholder === 'string') {
      return h('img', { src: placeholder, ...rest })
      // if the placeholder is an JSX element
    } else if (placeholder && typeof placeholder === 'function') {
      return placeholder()
    } else {
      // render a simple box
      const style: any = {}
      if (rest.width) style.width = rest.width + 'px'
      if (rest.height) style.height = rest.height + 'px'
      return h('div', { style, ...rest })
    }
  }
}
