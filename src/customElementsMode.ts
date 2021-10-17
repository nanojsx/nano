import { h, render, _render } from './core'

interface CustomElementsParameters {
  mode?: 'open' | 'closed'
  delegatesFocus?: boolean
}

export const defineAsCustomElements: (
  component: any,
  componentName: string,
  publicProps: string[],
  params?: CustomElementsParameters
) => void = function (component, componentName, publicProps, { mode = 'closed', delegatesFocus = false } = {}) {
  customElements.define(
    componentName,
    class extends HTMLElement {
      component: any

      constructor() {
        super()

        const shadowRoot = this.attachShadow({ mode, delegatesFocus })

        let ref
        const children = Array.from(this.children).map(c => render(c))

        // because nano-jsx update need parentElement, so DocumentFragment is not usable...
        const el = h(
          'div',
          null,
          _render({
            component,
            props: {
              children: children,
              ref: (r: any) => (ref = r)
            }
          })
        )
        this.component = ref

        shadowRoot.append(el)

        this.component.updatePropsValue = (name: string, value: any) => {
          // @ts-ignore
          if (!this.component.props) this.component.props = {}
          this.component.props[name] = value
          this.component[name] = value
        }
      }

      static get observedAttributes() {
        return publicProps
      }

      attributeChangedCallback(name: string, _: any, newValue: any) {
        this.component.updatePropsValue(name, newValue)
        this.component.update()
      }
    }
  )
}
