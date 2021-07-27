// inspired by https://codesandbox.io/s/build-own-react-router-v4-mpslz
declare const isSSR: boolean
declare const _nano: any

import { Component } from '../component'
import { FC, _render, h } from '../core'

const instances: any[] = []

const register = (comp: any) => instances.push(comp)
const unregister = (comp: any) => instances.splice(instances.indexOf(comp), 1)

const historyPush = (path: string) => {
  window.history.pushState({}, '', path)
  instances.forEach(instance => instance.handlePop())
}

const historyReplace = (path: string) => {
  window.history.replaceState({}, '', path)
  instances.forEach(instance => instance.handlePop())
}

const matchPath = (
  pathname: string,
  options: { exact?: boolean; path: string; regex?: { [param: string]: RegExp } }
) => {
  const { exact = false, regex } = options
  let { path } = options

  if (!path) {
    return {
      path: null,
      url: pathname,
      isExact: true
    }
  }

  let match
  let params = {}

  // path with params
  if (path.includes('/:')) {
    const pathArr = path.split('/')
    const pathnameArr = pathname.split('/')
    pathArr.forEach((p, i) => {
      if (/^:/.test(p)) {
        const key = p.slice(1)
        const value = pathnameArr[i]

        // if a regex is provided, check it it matches
        if (regex && regex[key]) {
          const regexMatch = regex[key].test(value)
          if (!regexMatch) return null
        }

        params = { ...params, [key]: value }

        pathArr[i] = pathnameArr[i]
      }
    })
    path = pathArr.join('/')
  }

  // catch all
  if (path === '*') match = [pathname]

  // regular path
  if (!match) match = new RegExp(`^${path}`).exec(pathname)

  if (!match) return null

  const url = match[0]
  const isExact = pathname === url

  if (exact && !isExact) return null

  return {
    path,
    url,
    isExact,
    params
  }
}

export class Switch extends Component<{ fallback?: any; children?: any }> {
  index: number = 0
  path: string = ''
  match = { index: -1, path: '' }

  didMount() {
    window.addEventListener('popstate', this.handlePop.bind(this))
    register(this)
  }

  didUnmount() {
    window.removeEventListener('popstate', this.handlePop.bind(this))
    unregister(this)
  }

  handlePop() {
    this.findChild()
    if (this.shouldUpdate()) this.update()
  }

  findChild() {
    this.match = { index: -1, path: '' }

    for (let i = 0; i < this.props.children.length; i++) {
      const child = this.props.children[i]
      const { path, exact, regex } = child.props
      const match = matchPath(typeof isSSR !== 'undefined' ? _nano.location.pathname : window.location.pathname, {
        path,
        exact,
        regex
      })
      if (match) {
        this.match.index = i
        this.match.path = path
        return
      }
    }
  }

  shouldUpdate() {
    return this.path !== this.match.path || this.index !== this.match.index
  }

  render() {
    this.findChild()

    const child = this.props.children[this.match.index]

    if (this.match.index === -1) {
      this.path = ''
      this.index = 0
    }

    if (child) {
      const { path } = child.props
      this.path = path
      this.index = this.match.index
      const el = _render(child)
      return _render(el)
    } else if (this.props.fallback) {
      return _render(this.props.fallback)
    } else {
      return h('div', { class: 'route' }, 'not found')
    }
  }
}

export const Route: FC<{ path: string; exact?: boolean; regex?: { [param: string]: RegExp }; children?: any }> = ({
  path,
  regex,
  children
}) => {
  // pass the path as props to the children
  children.forEach((child: any) => {
    if (child.props) child.props = { ...child.props, route: { path, regex } }
  })
  return children
}

export const to = (to: string, replace: boolean = false) => {
  replace ? historyReplace(to) : historyPush(to)
}

export const Link: FC<{ to: string; replace?: boolean; children?: any }> = ({ to, replace, children }) => {
  const handleClick = (event: Event) => {
    event.preventDefault()
    replace ? historyReplace(to) : historyPush(to)
  }

  return h('a', { href: to, onClick: (e: Event) => handleClick(e) }, children)
}
