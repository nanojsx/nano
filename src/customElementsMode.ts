import { render } from './core'

export const defineAsCustomElements: (component: any, componentName: string, mode?: 'open' | 'closed') => void =
  function (component, componentName, mode = 'closed') {
    customElements.define(
      componentName,
      class extends HTMLElement {
        component: any
        constructor() {
          super()
          const shadowRoot = this.attachShadow({ mode })
          // because nano-jsx update need parentElement, so DocumentFragment is not usable...
          const fragment = document.createElement('div')
          this.component = component
          render(this.component, fragment)
          shadowRoot.append(fragment)
        }

        static get observedAttributes() {
          return Object.keys(component.props)
        }

        attributeChangedCallback(name: string, _: any, newValue: any) {
          this.component.updatePropsValue(name, newValue)
          this.component.update()
        }
      }
    )
  }
