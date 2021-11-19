import { isSSR, render } from './core.ts'
import { documentSSR } from './regexDom.ts'
import { _state } from './state.ts'
import { detectSSR } from './helpers.ts'

const initGlobalVar = () => {
  const isSSR = detectSSR() === true ? true : undefined
  const location = { pathname: '/' }
  const document = isSSR ? documentSSR() : window.document
  globalThis._nano = { isSSR, location, document }
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
