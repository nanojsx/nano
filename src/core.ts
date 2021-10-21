declare const isSSR: boolean

export interface FC<P = {}> {
  (props: P): Element | void
  // (props: P, context?: any): any
}

/** Creates a new Microtask using Promise() */
export const tick = typeof Promise == 'function' ? Promise.prototype.then.bind(Promise.resolve()) : setTimeout

// const isDOMElement = (element: any) => {
//   return element && element.tagName && typeof element.tagName === 'string'
// }

export const removeAllChildNodes = (parent: HTMLElement) => {
  while (parent.firstChild) {
    parent.removeChild(parent.firstChild)
  }
}

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

export const appendChildren = (element: HTMLElement | SVGElement, children: HTMLElement[]) => {
  // if the child is an html element
  if (!Array.isArray(children)) {
    appendChildren(element, [children])
    return
  }

  // htmlCollection to array
  if (typeof children === 'object') children = Array.prototype.slice.call(children)

  children.forEach(child => {
    // if child is an array of children, append them instead
    if (Array.isArray(child)) appendChildren(element, child)
    else {
      // render the component
      const c = _render(child) as HTMLElement

      if (typeof c !== 'undefined') {
        // if c is an array of children, append them instead
        if (Array.isArray(c)) appendChildren(element, c)
        // apply the component to parent element
        else element.appendChild(c.nodeType == null ? document.createTextNode(c.toString()) : c)
      }
    }
  })
}

/**
 * A simple component for rendering SVGs
 */
const SVG = (props: any) => {
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
  let el = _render(component)

  if (Array.isArray(el)) {
    el = el.map(e => _render(e))
    if (el.length === 1) el = el[0]
  }

  if (parent) {
    if (removeChildNodes) removeAllChildNodes(parent)

    // if parent and child are the same, we replace the parent instead of appending to it
    if (el && parent.id && parent.id === el.id && parent.parentElement) {
      parent.parentElement.replaceChild(el, parent)
    } else {
      // append element(s) to the parent
      if (Array.isArray(el))
        el.forEach((e: any) => {
          appendChildren(parent, _render(e))
          //parent.appendChild(_render(e))
        })
      else appendChildren(parent, _render(el))
    }
    //@ts-ignore
    if (parent.ssr) return parent.ssr
    return parent
  }
  // returning one child or an array of children
  else {
    if (typeof isSSR === 'boolean' && isSSR === true && !Array.isArray(el)) return [el]
    return el
  }
}

export const _render = (comp: any): any => {
  // undefined
  if (typeof comp === 'undefined') return []

  // null
  if (comp == null) return []

  // string
  if (typeof comp === 'string') return comp

  // number
  if (typeof comp === 'number') return comp.toString()

  // SVGElement
  if (comp.tagName && comp.tagName.toLowerCase() === 'svg') return SVG({ children: [comp] })

  // HTMLElement
  if (comp.tagName) return comp

  // Class Component
  if (comp && comp.component && comp.component.isClass && comp.component.isClass()) return renderClassComponent(comp)

  // Functional Component
  if (comp.component && typeof comp.component === 'function') return renderFunctionalComponent(comp)

  // Array (render each child and return the array) (is probably a fragment)
  if (Array.isArray(comp)) return comp.map(c => _render(c)).flat()

  // function
  if (typeof comp === 'function') return _render(comp())

  // if component is a HTMLElement (rare case)
  if (comp.component && comp.component.tagName && typeof comp.component.tagName === 'string')
    return _render(comp.component)

  // (rare case)
  if (Array.isArray(comp.component)) return _render(comp.component)

  // (rare case)
  if (comp.component) return _render(comp.component)

  // object
  if (typeof comp === 'object') return []

  console.warn('Something unexpected happened with:', comp)
}

const renderFunctionalComponent = (fncComp: any): any => {
  const { component, props } = fncComp
  return _render(component(props))
}

const renderClassComponent = (classComp: any): any => {
  const { component, props } = classComp

  // calc hash
  const hash = strToHash(component.toString())

  // make hash accessible in constructor, without passing it to it
  component.prototype._getHash = () => hash

  const Component = new component(props)
  Component.willMount()

  let el = Component.render()
  el = _render(el)
  Component.elements = el

  // pass the component instance as ref
  if (props && props.ref) props.ref(Component)

  if (typeof isSSR === 'undefined')
    tick(() => {
      Component._didMount()
    })

  return el
}

/** @deprecated renderComponent() is deprecated, use _render() instead! */
export const renderComponent = (_component: any): any => {
  console.warn('DEPRECATED: renderComponent() is deprecated, use _render() instead!')

  // this fixes some ssr issues when using fragments
  // if (typeof isSSR === 'boolean' && isSSR === true && Array.isArray(el)) {
  //   el = el
  //     .map((e) => {
  //       return _render(e)
  //     })
  //     .join('')
  // }
}

const hNS = (tag: string) => document.createElementNS('http://www.w3.org/2000/svg', tag) as SVGElement

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
        .map(k => `${k}:${props[p][k]}`)
        .join(';')
        .replace(/[A-Z]/g, match => `-${match.toLowerCase()}`)
      props[p] = `${styles};`
    }

    // handel ref
    if (p === 'ref') ref = props[p]
    // handle events
    else if (isEvent(element, p.toLowerCase()))
      element.addEventListener(p.toLowerCase().substring(2), (e: any) => props[p](e))
    else if (/className/i.test(p)) console.warn('You can use "class" instead of "className".')
    else if (typeof props[p] !== 'undefined') element.setAttribute(p, props[p])
  }

  appendChildren(element, children)

  if (ref) ref(element)
  // @ts-ignore
  if (element.ssr) return element.ssr
  return element
}
