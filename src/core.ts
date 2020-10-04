export const Empty = []

export const tick = typeof Promise == 'function' ? Promise.prototype.then.bind(Promise.resolve()) : setTimeout

export const task = (task: () => void) => setTimeout(task, 0)

// https://stackoverflow.com/a/7616484/12656855
export const strToHash = (s: string) => {
  let hash = 0

  for (let i = 0; i < s.length; i++) {
    const chr = s.charCodeAt(i)
    hash = (hash << 5) - hash + chr
    hash |= 0 // Convert to 32bit integer
  }
  return Math.abs(hash).toString(32)
}

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
  else if (component === null) return []
  else if (component.component === null) return []
  else if (component.tagName) {
    if (component.tagName.toLowerCase() === 'svg') return SVG({ children: [component] })
    else return component
  }

  let el
  let props = component.props || { children: [] }
  component = component.component || component

  // is class component
  if (component.prototype && component.prototype.constructor) {
    const Component = new component(props, strToHash(component.toString()))

    Component.willMount()
    el = Component.elements = Component.render()

    // @ts-ignore
    if (typeof isSSR === 'undefined')
      tick(() => {
        Component._didMount()
        Component.didMount()
      })
  }
  //  is  functional component
  else if (typeof component === 'function') {
    el = component(props)
  }
  // if DOM element
  else {
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

export const hNS = (tag: string) => document.createElementNS('http://www.w3.org/2000/svg', tag) as SVGElement

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

  // check if the element includes the event (for example 'oninput')
  const isEvent = (el: HTMLElement | any, p: string) => {
    // check if the event begins with 'on'
    if (0 !== p.indexOf('on')) return false

    // we return true if SSR, since otherwise it will get rendered
    if (el.ssr) return true

    // check if the event is present in the element as object (null) or as function
    return typeof el[p] === 'object' || typeof el[p] === 'function'
  }

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
    else if (isEvent(element, p.toLowerCase()))
      element.addEventListener(p.toLowerCase().substring(2), (e: any) => props[p](e))
    else if (/className/i.test(p)) console.warn('You can use "class" instead of "className".')
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
