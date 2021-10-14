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
        const shadowRoot = this.attachShadow({ mode: 'open' })
        const rootElement = document.createElement('div')
        shadowRoot.appendChild(rootElement)
        render(component, rootElement)
      }
    }
  )
}
