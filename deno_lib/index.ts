// core
export { h, render, hydrate, tick } from './core.ts'
export type { FC } from './core.ts'

// component
export { Component } from './component.ts'

// built-in Components
export * from './components/index.ts'

// export some defaults (Nano)
import { h, render, hydrate, isSSR } from './core.ts'
import { renderSSR } from './ssr.ts'
export default { h, render, hydrate, renderSSR, isSSR }

// other
export { isSSR }
export { jsx } from './jsx.ts'
export { hydrateLazy } from './lazy.ts'
export { nodeToString, task } from './helpers.ts'
export { renderSSR } from './ssr.ts'
export { Fragment } from './fragment.ts'
export { Store } from './store.ts'
export { createContext, useContext } from './context.ts'
export { withStyles } from './withStyles.ts'
export { defineAsCustomElements } from './customElementsMode.ts'

// version
export { printVersion } from './helpers.ts'
export { VERSION } from './version.ts'
