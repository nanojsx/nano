import { isSSR, render } from './core.js'
import { documentSSR } from './regexDom.js'
import { _state } from './state.js'
import { detectSSR } from './helpers.js'

// functions that should only be available on the server-side
const ssrTricks = {
  isWebComponent: (tagNameOrComponent: any) => {
    return (
      typeof tagNameOrComponent === 'string' &&
      tagNameOrComponent.includes('-') &&
      _nano.customElements.has(tagNameOrComponent)
    )
  },
  renderWebComponent: (tagNameOrComponent: any, props: any, children: any, _render: any) => {
    const customElement = _nano.customElements.get(tagNameOrComponent)
    const component = _render({ component: customElement, props: { ...props, children: children } })
    // get the html tag and the innerText from string
    // match[1]: HTMLTag
    // match[2]: innerText
    const match = component.toString().match(/^<(?<tag>[a-z]+)>(.*)<\/\k<tag>>$/)
    if (match) {
      const element = document.createElement(match[1])
      element.innerText = match[2]

      // eslint-disable-next-line no-inner-declarations
      function replacer(match: string, p1: string, _offset: number, _string: string): string {
        return match.replace(p1, '')
      }
      // remove events like onClick from DOM
      element.innerText = element.innerText.replace(/<\w+[^>]*(\s(on\w*)="[^"]*")/gm, replacer)

      return element
    } else {
      return null
    }
  }
}

const initGlobalVar = () => {
  const isSSR = detectSSR() === true ? true : undefined
  const location = { pathname: '/' }
  const document = isSSR ? documentSSR() : window.document
  globalThis._nano = { isSSR, location, document, customElements: new Map(), ssrTricks }
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
