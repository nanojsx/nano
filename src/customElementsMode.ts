import { render } from './core'

export const defineAsCustomElements: (component: any, componentName: string) => void = function (
  component,
  componentName
) {
  customElements.define(
    componentName,
    class extends HTMLElement {
      constructor() {
        super()
        const shadowRoot = this.attachShadow({ mode: 'closed' })
        // because nano-jsx update need parentElement, so DocumentFragment is not usable...
        const fragment = document.createElement('div')
        render(component, fragment)
        shadowRoot.append(fragment)
      }
    }
  )
}
