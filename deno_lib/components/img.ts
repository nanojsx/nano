import { Component } from '../component.ts'
import { h, strToHash } from '../core.ts'

interface Props {
  [key: string]: any
  src: string
  height?: number | string
  width?: number | string
  lazy?: boolean
  placeholder?: any
}

/**
 * A useful Image component
 * Add <Img lazy ..., to lazy load the img source
 * Add <Img width="100" height="100" ..., to specify img element's size.
 * Add <Img placeholder="src or element" ...., to prepare placeholder for img.
 */
export class Img extends Component<Props> {
  constructor(props: Props) {
    super(props)

    const { src, key } = props

    // id has to be unique
    this.id = `${strToHash(src)}-${strToHash(JSON.stringify(props))}`
    if (key) this.id += `key-${key}`

    // this could also be done in willMount()
    if (!this.state) this.setState({ isLoaded: false, image: undefined })
  }

  didMount() {
    const { lazy = true, placeholder, children, key, ref, ...rest } = this.props

    if (typeof lazy === 'boolean' && lazy === false) return

    const observer = new IntersectionObserver(
      (entries, observer) => {
        entries.forEach(entry => {
          if (entry.isIntersecting) {
            observer.disconnect()
            this.state.image = h('img', { ...rest }) as HTMLImageElement
            if (this.state.image.complete) {
              this.state.isLoaded = true
              this.update()
            } else {
              this.state.image.onload = () => {
                this.state.isLoaded = true
                this.update()
              }
            }
          }
        })
      },
      { threshold: [0, 1] }
    )
    observer.observe(this.elements[0])
  }
  render() {
    const { src, placeholder, children, lazy = true, key, ref, ...rest } = this.props

    // return the img tag if not lazy loaded
    if (typeof lazy === 'boolean' && lazy === false) {
      this.state.image = h('img', { src, ...rest }) as HTMLImageElement
      return this.state.image
    }

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
      const style: Record<string, any> = {}
      if (rest.width) style.width = `${rest.width}px`
      if (rest.height) style.height = `${rest.height}px`
      const { width, height, ...others } = rest
      return h('div', { style, ...others })
    }
  }
}
