import { h, isSSR, render, _render } from './core.js'

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
  shadow?: ShadowRootInit
) => void = function (component, componentName, publicProps, shadow) {
  if (isSSR()) {
    defineAsCustomElementsSSR(component, componentName, publicProps)
    return
  }

  customElements.define(
    componentName,
    class extends HTMLElement {
      component: any
      $root: ShadowRoot | HTMLElement
      private isFunctionalComponent: boolean
      private functionalComponentsProps: any

      constructor() {
        super()

        if (shadow) {
          this.attachShadow(shadow)
          this.$root = this.shadowRoot as ShadowRoot
        } else {
          this.$root = this
        }

        let ref

        const el = this.buildEl(
          _render({
            component,
            props: {
              ref: (r: any) => (ref = r),
              children: Array.from(this.children).map(c => render(c))
            }
          })
        )

        // ------------------------------ first render
        this.component = ref
        this.isFunctionalComponent = !component.isClass
        this.functionalComponentsProps = {}
        this.appendEl(el)
        // ------------------------------------------

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

      private buildEl(contents: any) {
        // because nano-jsx update needs parentElement, we need
        // to wrap the element in a div when using shadow mode
        return h(this.shadowRoot ? 'div' : 'template', null, contents)
      }

      private appendEl(el: any) {
        if (this.shadowRoot) {
          // el.dataset.wcRoot = true
          this.$root.append(el)
        } else {
          this.$root.append(...el.childNodes)
        }
      }

      private removeChildren() {
        if (this.$root) {
          const children = Array.from(this.$root?.children) || []
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

          const el = this.buildEl(
            _render({
              component,
              props: {
                children: [],
                ref: (r: any) => (this.component = r),
                ...this.functionalComponentsProps
              }
            })
          )

          this.appendEl(el)
        }
      }
    }
  )
}
