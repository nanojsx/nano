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
      private isFunctionalComponent: boolean
      private functionalComponentsProps: any

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
        this.isFunctionalComponent = !component.isClass
        this.functionalComponentsProps = {}

        shadowRoot.append(el)
        if (!this.isFunctionalComponent) {
          this.component.updatePropsValue = (name: string, value: any) => {
            // @ts-ignore
            if (!this.component.props) this.component.props = {}
            this.component.props[name] = value
            this.component[name] = value
          }
        }
      }

      static get observedAttributes() {
        return publicProps
      }

      private removeChildren() {
        for (const el of this.shadowRoot?.children ?? []) {
          el.remove()
        }
      }

      attributeChangedCallback(name: string, _: any, newValue: any) {
        if (!this.isFunctionalComponent) {
          this.component.updatePropsValue(name, newValue)
          this.component.update()
        } else {
          this.removeChildren()
          this.functionalComponentsProps[name] = newValue
          const el = h(
            'div',
            null,
            _render({
              component,
              props: {
                children: [],
                ref: (r: any) => (this.component = r),
                ...this.functionalComponentsProps
              }
            })
          )
          this.shadowRoot!.append(el)
        }
      }
    }
  )
}
