import { render } from './core'

export const defineAsCustomElements: (component: any, componentName: string, mode?: 'open' | 'closed') => void =
  function (component, componentName, mode = 'closed') {
    customElements.define(
      componentName,
      class extends HTMLElement {
        constructor() {
          super()
          const shadowRoot = this.attachShadow({ mode })
          // because nano-jsx update need parentElement, so DocumentFragment is not usable...
          const fragment = document.createElement('div')
          render(component, fragment)
          shadowRoot.append(fragment)
        }
      }
    )
  }
