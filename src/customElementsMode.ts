import { h, isSSR, render, _render } from './core.js'

export interface CustomElementsParameters {
  mode?: 'open' | 'closed'
  delegatesFocus?: boolean
}

const defineAsCustomElementsSSR = (
  component: any,
  componentName: string,
  _publicProps: string[] = [],
  _options: any = {}
) => {
  if (!/^[a-zA-Z0-9]+-[a-zA-Z0-9]+$/.test(componentName))
    console.log(`Error: WebComponent name "${componentName}" is invalid.`)
  else _nano.customElements.set(componentName, component)
}

export const defineAsCustomElements: (
  component: any,
  componentName: string,
  publicProps: string[],
  params?: CustomElementsParameters
) => void = function (component, componentName, publicProps, { mode = 'closed', delegatesFocus = false } = {}) {
  if (isSSR()) {
    defineAsCustomElementsSSR(component, componentName, publicProps)
    return
  }

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
        if (this.shadowRoot) {
          const children = Array.from(this.shadowRoot?.children) || []
          for (const el of children) {
            el.remove()
          }
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
