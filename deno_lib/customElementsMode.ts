import { h, isSSR, render, _render } from './core.ts'
import { Component } from './component.ts'

type ComponentType<P extends object> = Component<P> | ((props: P) => any)

const defineAsCustomElementsSSR = <P extends object>(
  component: ComponentType<P>,
  componentName: `${string}-${string}`,
  _publicProps: (keyof P)[] = [],
  _options: any = {}
) => {
  if (!/^[a-zA-Z0-9]+-[a-zA-Z0-9]+$/.test(componentName))
    console.log(`Error: WebComponent name "${componentName}" is invalid.`)
  else _nano.customElements.set(componentName, component)
}

export const defineAsCustomElements: <P extends object>(
  component: ComponentType<P>,
  componentName: `${string}-${string}`,
  publicProps: (keyof P)[],
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
      private readonly isFunctionalComponent: boolean
      private readonly functionalComponentsProps: any

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
        this.isFunctionalComponent = !('isClass' in component)
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
        return h('template', null, contents)
      }

      private appendEl(el: any) {
        this.$root.append(...el.childNodes)
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
