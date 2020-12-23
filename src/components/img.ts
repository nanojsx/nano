import { Component } from '../component'
import { h, strToHash } from '../core'

export class Img extends Component {
  constructor(props: any) {
    const { src, key } = props
    const id = key ? key : src ? src : 'none'

    // key has be be unique, by default key is the image src
    super(props)
    this.id = strToHash(id)

    // this could also be done in willMount()
    if (!this.state) this.setState({ isLoaded: false, image: undefined })
  }

  didMount() {
    const { placeholder, children, key, ...rest } = this.props

    const observer = new IntersectionObserver(
      (entries, observer) => {
        entries.forEach((entry) => {
          if (entry.isIntersecting) {
            observer.disconnect()
            this.state.image = h('img', { ...rest }) as HTMLImageElement
            this.state.image.onload = () => {
              this.state.isLoaded = true
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
    const { src, placeholder, children, lazy = true, key, ...rest } = this.props

    // return the img tag if not lazy loaded
    if (typeof lazy === 'boolean' && lazy === false) return h('img', { src, ...rest }) as HTMLImageElement

    // if it is visible and loaded, show the image
    if (this.state.isLoaded) {
      return this.state.image
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
