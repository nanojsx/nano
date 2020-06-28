import { Component } from './component'
import { createElement } from './core'

export class Img extends Component {
  isLoaded = false
  image: HTMLImageElement

  didMount() {
    const { src = '', srcset = '', ...rest } = this.props

    const observer = new IntersectionObserver(
      (entries, observer) => {
        entries.forEach((entry) => {
          if (entry.isIntersecting) {
            observer.disconnect()
            this.image = createElement('img', { src, srcset, ...rest }) as HTMLImageElement
            this.image.onload = () => {
              this.isLoaded = true
              this.update()
            }
          }
        })
      },
      { threshold: 0 }
    )
    observer.observe(this.element)
  }
  render() {
    const { placeholder = '', ...rest } = this.props

    // if it is visible and loaded, show the image
    if (this.isLoaded) {
      return this.image
      // if the placeholder is an image src
    } else if (placeholder && typeof placeholder === 'string') {
      return createElement('img', { src: placeholder, ...rest })
      // if the placeholder is an JSX element
    } else if (placeholder && typeof placeholder === 'function') {
      return placeholder()
    } else {
      // render a simple box
      const style: any = {}
      if (rest.width) style.width = rest.width + 'px'
      if (rest.height) style.height = rest.height + 'px'
      return createElement('div', { style, ...rest })
    }
  }
}
