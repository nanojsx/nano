import { Component } from './component'
import { createElement } from './nano'

/**
 * A simple Link component
 * Add <Link prefetch ..., to prefetch the html document
 * Add <Link prefetch="hover" ..., to prefetch the html document on hovering over the link element.
 */
export class Link extends Component {
  prefetchOnHover() {
    this.element.addEventListener('mouseover', () => this.addPrefetch(), { once: true })
  }

  addPrefetch() {
    let doesAlreadyExist = false

    // check if it is already on the dom
    const links = document.getElementsByTagName('link')
    for (let i = 0; i < links.length; i++) {
      // if it is not already on the dom, add it
      if (links[i].getAttribute('rel') === 'prefetch' && links[i].getAttribute('href') === this.props.href) {
        doesAlreadyExist = true
      }
    }

    if (!doesAlreadyExist) {
      const prefetch = document.createElement('link')
      prefetch.setAttribute('rel', 'prefetch')
      prefetch.setAttribute('href', this.props.href)
      prefetch.setAttribute('as', 'document')
      document.head.appendChild(prefetch)
    }
  }

  didMount() {
    const { prefetch } = this.props
    if (prefetch) {
      if (prefetch === 'hover') this.prefetchOnHover()
      else this.addPrefetch()
    }
  }

  render() {
    // separate children and prefetch from props
    const { children, prefetch, ...rest } = this.props

    // some warning messages
    if (!this.props.href) console.warn('Please add "href" to <Link>')
    if (children.length === 0) console.warn('Please add a child to <Link> (<Link>your child</Link>)')

    return createElement('a', { ...rest }, ...children) as any
  }
}
