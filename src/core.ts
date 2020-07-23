export const Empty = []

export const tick = typeof Promise == 'function' ? Promise.prototype.then.bind(Promise.resolve()) : setTimeout

export const removeAllChildNodes = (parent: HTMLElement) => {
  while (parent.firstChild) {
    parent.removeChild(parent.firstChild)
  }
}

export const appendChildren = (element: any, children: any) => {
  // if the child is an html element
  if (!Array.isArray(children)) {
    appendChildren(element, [children])
    return
  }

  // htmlCollection to array
  if (typeof children === 'object') children = Array.prototype.slice.call(children)

  children.forEach((child: any) => {
    // if child is an array of children, append them instead
    if (Array.isArray(child)) appendChildren(element, child)
    else {
      // render the component
      let c = renderComponent(child) as HTMLElement
      // if c is an array of children, append them instead
      if (Array.isArray(c)) appendChildren(element, c)
      // apply the component to parent element
      else element.appendChild(c.nodeType == null ? document.createTextNode(c.toString()) : c)
    }
  })
}

/**
 * A simple component for rendering SVGs
 */
export const SVG = (props: any) => {
  const child = props.children[0] as SVGElement
  const attrs = child.attributes

  const svg = hNS('svg') as SVGElement
  for (let i = attrs.length - 1; i >= 0; i--) {
    svg.setAttribute(attrs[i].name, attrs[i].value)
  }
  svg.innerHTML = child.innerHTML

  return svg as any
}

export const hydrate = (component: any, parent: HTMLElement | null = null, removeChildNodes = true) => {
  return render(component, parent, removeChildNodes)
}

/** Returns the populated parent if available else  one child or an array of children */
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
    if (parent.id && parent.id === el.id) {
      // @ts-ignore
      parent.parentElement.replaceChild(el, parent)
    } else {
      // append element(s) to the parent
      if (Array.isArray(el))
        el.forEach((e: any) => {
          appendChildren(parent, renderComponent(e))
          //parent.appendChild(renderComponent(e))
        })
      else appendChildren(parent, renderComponent(el))
    }

    // @ts-ignore
    if (parent.ssr) return parent.ssr
    return parent
  }
  // returning one child or an array of children
  else {
    // @ts-ignore
    if (typeof isSSR === 'boolean' && isSSR === true && !Array.isArray(el)) return [el]
    return el
  }
}

export const renderComponent = (component: { component: any; props?: any; tagName?: any } | any): any => {
  // handle undefined, null and svg, and jsx element
  if (typeof component === 'undefined') return 'undefined'
  else if (component === null) return 'null'
  else if (component.tagName) {
    if (component.tagName.toLowerCase() === 'svg') return SVG({ children: [component] })
    else return component
  }

  let el
  let props = component.props || { children: [] }
  component = component.component || component

  // TODO(yandeu) This looks very unsafe, is there a better way to detect if it is a function or class?
  // does only work in > ES2015
  // const isClass = (fn: any) => /^class/.test(fn.toString())

  if (/^class/.test(component.toString())) {
    const Component = new component()
    Component.props = props
    Component.willMount()

    Component.element = Component.render()

    el = Component.element

    // @ts-ignore
    if (typeof isSSR === 'undefined')
      tick(() => {
        Component._didMount()
        Component.didMount()
      })
  } else if (typeof component === 'function') {
    el = component(props)
  } else {
    el = component
  }

  // this fixes some ssr issues when using fragments
  // @ts-ignore
  if (typeof isSSR === 'boolean' && isSSR === true && Array.isArray(el)) {
    el = el
      .map((e) => {
        return renderComponent(e)
      })
      .join('')
  }

  if (el.component) return renderComponent(el) as HTMLElement
  return el
}

export const hNS = (tag: string) => {
  return document.createElementNS('http://www.w3.org/2000/svg', tag) as SVGElement
}

// https://stackoverflow.com/a/42405694/12656855
export const h = (tagNameOrComponent: any, props: any, ...children: any) => {
  // if tagNameOrComponent is a component
  if (typeof tagNameOrComponent !== 'string')
    return { component: tagNameOrComponent, props: { ...props, children: children } }

  let ref

  const element =
    tagNameOrComponent === 'svg'
      ? (hNS('svg') as SVGElement)
      : (document.createElement(tagNameOrComponent) as HTMLElement)

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

    // handel ref
    if (p === 'ref') ref = props[p]
    // handle events
    else if (/^on[A-Z]\w+$/gm.test(p)) element.addEventListener(p.toLowerCase().substring(2), (e) => props[p](e))
    // else if (/className/i.test(p)) console.warn('You can use "class" instead of "className".')
    else element.setAttribute(p, props[p])
  }

  // child is text
  // if (children.length === 1 && typeof children[0] === 'string') {
  //   element.innerHTML = children[0]
  //   if (ref) ref(element)
  //   return element
  // }

  appendChildren(element, children)

  if (ref) ref(element)
  // @ts-ignore
  if (element.ssr) return element.ssr
  return element
}
