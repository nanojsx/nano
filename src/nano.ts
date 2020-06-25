export const Fragment = (props: any) => {
  return props.children
}

const removeAllChildNodes = (parent: HTMLElement) => {
  while (parent.firstChild) {
    parent.removeChild(parent.firstChild)
  }
}

/**
 * A simple component for rendering SVGs
 */
const SVG = (props: any) => {
  const child = props.children[0] as SVGElement
  const attrs = child.attributes

  const svg = document.createElementNS('http://www.w3.org/2000/svg', 'svg') as SVGElement
  for (let i = attrs.length - 1; i >= 0; i--) {
    svg.setAttribute(attrs[i].name, attrs[i].value)
  }
  svg.innerHTML = child.innerHTML

  return svg as any
}

export const createContext = (value: any) => {
  return {
    Provider: (props: any) => {
      if (props.value) value = props.value
      return props.children
    },
    Consumer: (props: any) => {
      return { component: props.children[0](value), props: { ...props, context: value } }
    },
  }
}

/** Returns one child or an array of children */
export const render = (component: any, parent: HTMLElement | null = null, removeChildNodes = true) => {
  let el = renderComponent(component)

  if (Array.isArray(el)) {
    el = el.map((e) => {
      return renderComponent(e)
    })
  }

  if (!!parent) {
    if (removeChildNodes) removeAllChildNodes(parent)

    // if parent and child are the same, we replace the parent instead of appending to it
    if (parent.id === el.id) {
      parent.parentElement?.replaceChild(el, parent)
    } else {
      // append element(s) to the parent
      if (Array.isArray(el))
        el.forEach((e: any) => {
          parent.appendChild(renderComponent(e))
        })
      else parent.appendChild(renderComponent(el))
    }
  }

  // returning one child or an array of children
  return el
}

const renderComponent = (component: { component: any; props?: any; tagName?: any } | any): any => {
  // if it is a SVG, we render the custom SVG HOC
  if (component?.tagName?.toLowerCase() === 'svg') {
    return SVG({ children: [component] })
  }

  // if it is already a dom element, simply return it
  if (component.tagName) return component

  let el
  let props = component?.props || { children: [] }
  component = component?.component || component

  // TODO(yandeu) This looks very unsafe, is there a better way to detect if it is a function or class?
  // does only work in > ES2015
  const isClass = (fn: any) => /^class/.test(fn?.toString())

  if (isClass(component)) {
    const Component = new component()
    Component.props = props
    Component.willMount?.()
    Component.element = Component.render()

    // if it is a fragment, Component.element will be an array
    if (Array.isArray(Component.element)) Component.element = Component.element[0]
    el = Component.element

    if (Component.didMount) setTimeout(() => Component.didMount(), 0)
  } else if (typeof component === 'function') {
    el = component(props)
  } else {
    el = component
  }

  if (el.component) return renderComponent(el) as HTMLElement
  return el
}

// https://stackoverflow.com/a/42405694/12656855
export const createElement = (tagNameOrComponent: any, props: any = {}, ...children: any) => {
  // if tagNameOrComponent is a component
  if (typeof tagNameOrComponent !== 'string') {
    const p = { ...props, children: children }
    return { component: tagNameOrComponent, props: p }
  }

  let ref

  const element =
    tagNameOrComponent === 'svg'
      ? (document.createElementNS('http://www.w3.org/2000/svg', 'svg') as SVGElement)
      : (document.createElement(tagNameOrComponent) as HTMLElement)

  // simply add more if needed in the future
  const events = ['onInput', 'onClick', 'onChange', 'onSubmit']

  for (const p in props) {
    // https://stackoverflow.com/a/45205645/12656855
    // style object to style string
    if (p === 'style' && typeof props[p] === 'object') {
      const styles = Object.keys(props[p])
        .map((k) => `${k}:${props[p][k]}`)
        .join(';')
        .replace(/[A-Z]/g, (match) => `-${match.toLowerCase()}`)
      props[p] = styles + ';'
    }

    if (p === 'ref') ref = props[p]
    else if (events.find((e) => e === p)) element.addEventListener(p.toLowerCase().substring(2), (e) => props[p](e))
    else if (/className/i.test(p)) console.warn('You can use "class" instead of "className".')
    else element.setAttribute(p, props[p])
  }

  // child is text
  if (children.length === 1 && typeof children[0] === 'string') {
    element.innerHTML = children[0]
    if (ref) ref(element)
    return element
  }

  const appendChildren = (children: any) => {
    children.forEach((child: any) => {
      // if child is an array of children, append them instead
      if (Array.isArray(child)) appendChildren(child)
      else {
        // render the component
        let c = renderComponent(child) as HTMLElement
        // if c is an array of children, append them instead
        if (Array.isArray(c)) appendChildren(c)
        // apply the component to parent element
        else element.appendChild(c.nodeType == null ? document.createTextNode(c.toString()) : c)
      }
    })
  }

  appendChildren(children)

  if (ref) ref(element)
  return element
}
