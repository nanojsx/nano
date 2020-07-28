import { Component } from '../component'
import { Helmet } from './helmet'
import { h } from '../core'
import { Fragment } from '../fragment'

/**
 * A simple Link component
 * Add <Link prefetch ..., to prefetch the html document
 * Add <Link prefetch="hover" ..., to prefetch the html document on hovering over the link element.
 */
export class Link extends Component {
  prefetchOnHover() {
    this.elements[0].addEventListener('mouseover', () => this.addPrefetch(), { once: true })
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
      { threshold: [0, 1] }
    )
    observer.observe(this.elements[0])
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
      const prefetch = h('link', { rel: 'prefetch', href: this.props.href, as: 'document' }) as HTMLElement
      document.head.appendChild(prefetch)
    }
  }

  didMount() {
    const { href, prefetch, delay = 0, back = false } = this.props

    if (back)
      this.elements[0].addEventListener('click', (e: any) => {
        e.preventDefault()
        const target = e.target as HTMLLinkElement
        if (target.href === document.referrer) window.history.back()
        else window.location.href = target.href
      })

    if (delay > 0)
      this.elements[0].addEventListener('click', (e: any) => {
        e.preventDefault()
        setTimeout(() => (window.location.href = href), delay)
      })

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

    const a = h('a', { ...rest }, ...children) as any

    // if ssr
    if (prefetch === true && !(typeof window !== 'undefined' && window.document)) {
      // <link rel="prefetch" href="/index.html" as="document"></link>
      const link = h('link', { rel: 'prefetch', href: this.props.href, as: 'document' })
      const helmet = h(Helmet, null, link)

      return h(Fragment, null, [helmet, a])
    }
    // if not ssr
    else {
      return a
    }
  }
}
