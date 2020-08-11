import './types'

export { h, render, hydrate, removeAllChildNodes, renderComponent, tick } from './core'
export { jsx } from './jsx'
export { hydrateLazy } from './lazy'
export { nodeToString } from './helpers'
export { renderSSR } from './ssr'

export { Component } from './component'
export { Fragment } from './fragment'
export { Store } from './store'
export { createContext } from './context'
export { withStyles } from './withStyles'

// components
export { Helmet } from './components/helmet'
export { Img } from './components/img'
export { Link } from './components/link'
export { Visible } from './components/visible'

// export default (Nano)
import { h, render, hydrate } from './core'
import { renderSSR } from './ssr'
import { createContext } from './context'
export default { h, render, hydrate, renderSSR, createContext }
