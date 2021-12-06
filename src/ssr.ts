import { isSSR, render } from './core'
import { documentSSR } from './regexDom'
import { _state } from './state'
import { detectSSR } from './helpers'

const initGlobalVar = () => {
  const isSSR = detectSSR() === true ? true : undefined
  const location = { pathname: '/' }
  const document = isSSR ? documentSSR() : window.document
  globalThis._nano = { isSSR, location, document, customElements: new Map() }
}
initGlobalVar()

export const initSSR = (pathname: string = '/') => {
  _nano.location = { pathname }
  globalThis.document = _nano.document = isSSR() ? documentSSR() : window.document
}

export const renderSSR = (component: any, options: { pathname?: string; clearState?: boolean } = {}) => {
  const { pathname, clearState = true } = options

  initSSR(pathname)
  if (clearState) _state.clear()

  return render(component, null, true).join('') as string
}

export const clearState = () => {
  _state.clear()
}
