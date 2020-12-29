import './types.ts'

export { h, render, hydrate, removeAllChildNodes, tick } from './core.ts'
export { jsx } from './jsx.ts'
export { hydrateLazy } from './lazy.ts'
export { nodeToString, task } from './helpers.ts'
export { renderSSR } from './ssr.ts'

export { Component } from './component.ts'
export { Fragment } from './fragment.ts'
export { Store } from './store.ts'
export * as Router from './router.ts'
export { createContext } from './context.ts'
export { withStyles } from './withStyles.ts'

// components
export { Helmet } from './components/helmet.ts'
export { Img } from './components/img.ts'
export { Link } from './components/link.ts'
export { Visible } from './components/visible.ts'

// export default (Nano)
import { h, render, hydrate } from './core.ts'
import { renderSSR } from './ssr.ts'
import { createContext } from './context.ts'
export default { h, render, hydrate, renderSSR, createContext }

// version
import { logVersion } from './helpers.ts'
logVersion()
