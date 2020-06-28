import { Component } from '../component'
import { createElement } from '../core'

/**
 * A simple Link component
 * Add <Link prefetch ..., to prefetch the html document
 * Add <Link prefetch="hover" ..., to prefetch the html document on hovering over the link element.
 */
export class Link extends Component {
  prefetchOnHover() {
    this.element.addEventListener('mouseover', () => this.addPrefetch(), { once: true })
  }

  prefetchOnVisible() {
    const observer = new IntersectionObserver(
      (entries, observer) => {
        entries.forEach((entry) => {
          if (entry.isIntersecting) {
            observer.disconnect()
            this.addPrefetch()
          }
        })
      },
      { threshold: 1.0 }
    )
    observer.observe(this.element)
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
      const prefetch = createElement('link', { rel: 'prefetch', href: this.props.href, as: 'document' }) as HTMLElement
      document.head.appendChild(prefetch)
    }
  }

  didMount() {
    const { prefetch } = this.props
    if (prefetch) {
      if (prefetch === 'hover') this.prefetchOnHover()
      else if (prefetch === 'visible') this.prefetchOnVisible()
      else this.addPrefetch()
    }
  }

  render() {
    // separate children and prefetch from props
    const { children, prefetch, ...rest } = this.props

    // some warning messages
    if (!this.props.href) console.warn('Please add "href" to <Link>')
    if (children.length !== 1) console.warn('Please add ONE child to <Link> (<Link>child</Link>)')

    return createElement('a', { ...rest }, ...children) as any
  }
}
