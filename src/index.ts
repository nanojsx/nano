// core
export { h, render, hydrate, tick } from './core'
export type { FC } from './core'

// component
export { Component } from './component'

// built-in Components
export * from './components/index'

// export some defaults (Nano)
import { h, render, hydrate } from './core'
import { renderSSR } from './ssr'
export default { h, render, hydrate, renderSSR }

// other
export { jsx } from './jsx'
export { hydrateLazy } from './lazy'
export { nodeToString, task } from './helpers'
export { renderSSR } from './ssr'
export { Fragment } from './fragment'
export { Store } from './store'
export { createContext } from './context'
export { withStyles } from './withStyles'

// version
export { printVersion } from './helpers'
export { VERSION } from './version'
