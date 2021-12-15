import './core.types'
import { HTMLElementSSR } from './regexDom'

export const isSSR = () => typeof _nano !== 'undefined' && _nano.isSSR === true

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

export const appendChildren = (element: HTMLElement | SVGElement, children: HTMLElement[], escape = true) => {
  // if the child is an html element
  if (!Array.isArray(children)) {
    appendChildren(element, [children], escape)
    return
  }

  // htmlCollection to array
  if (typeof children === 'object') children = Array.prototype.slice.call(children)

  children.forEach(child => {
    // if child is an array of children, append them instead
    if (Array.isArray(child)) appendChildren(element, child, escape)
    else {
      // render the component
      const c = _render(child) as HTMLElement

      if (typeof c !== 'undefined') {
        // if c is an array of children, append them instead
        if (Array.isArray(c)) appendChildren(element, c, escape)
        // apply the component to parent element
        else {
          if (isSSR() && !escape) element.appendChild(c.nodeType == null ? (c.toString() as unknown as Node) : c)
          else element.appendChild(c.nodeType == null ? document.createTextNode(c.toString()) : c)
        }
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

  if (isSSR()) return child

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
    return parent
  }
  // returning one child or an array of children
  else {
    if (isSSR() && !Array.isArray(el)) return [el]
    return el
  }
}

export const _render = (comp: any): any => {
  // undefined
  if (typeof comp === 'undefined') return []

  // null
  if (comp == null) return []

  // false
  if (comp === false) return []

  // string
  if (typeof comp === 'string') return comp

  // number
  if (typeof comp === 'number') return comp.toString()

  // SVGElement
  if (comp.tagName && comp.tagName.toLowerCase() === 'svg') return SVG({ children: [comp] })

  // HTMLElement
  if (comp.tagName) return comp

  // Class Component
  if (comp && comp.component && comp.component.isClass) return renderClassComponent(comp)

  // Functional Component
  if (comp.component && typeof comp.component === 'function') return renderFunctionalComponent(comp)

  // Array (render each child and return the array) (is probably a fragment)
  if (Array.isArray(comp)) return comp.map(c => _render(c)).flat()

  // function
  if (typeof comp === 'function' && !comp.isClass) return _render(comp())

  // if component is a HTMLElement (rare case)
  if (comp.component && comp.component.tagName && typeof comp.component.tagName === 'string')
    return _render(comp.component)

  // (rare case)
  if (Array.isArray(comp.component)) return _render(comp.component)

  // (rare case)
  if (comp.component) return _render(comp.component)

  // object
  if (typeof comp === 'object') return []

  // sometimes in SSR
  if (comp.isClass) return new comp().render()

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

  if (!isSSR())
    // @ts-ignore
    tick(() => {
      Component._didMount()
    })

  return el
}

const hNS = (tag: string) => document.createElementNS('http://www.w3.org/2000/svg', tag) as SVGElement

// https://stackoverflow.com/a/42405694/12656855
export const h = (tagNameOrComponent: any, props: any, ...children: any) => {
  // render WebComponent in SSR
  if (
    isSSR() &&
    typeof tagNameOrComponent === 'string' &&
    tagNameOrComponent.includes('-') &&
    _nano.customElements.has(tagNameOrComponent)
  ) {
    const customElement = _nano.customElements.get(tagNameOrComponent)
    const component = _render({ component: customElement, props: { ...props, children: children } }) as HTMLElementSSR
    // get the html tag and the innerText from string
    // match[1]: HTMLTag
    // match[2]: innerText
    const match = component.toString().match(/^<(?<tag>[a-z]+)>(.*)<\/\k<tag>>$/)
    if (match) {
      const element = new HTMLElementSSR(match[1])
      element.innerText = match[2]

      // eslint-disable-next-line no-inner-declarations
      function replacer(match: string, p1: string, _offset: number, _string: string): string {
        return match.replace(p1, '')
      }
      // remove events like onClick from DOM
      element.innerText = element.innerText.replace(/<\w+[^>]*(\s(on\w*)="[^"]*")/gm, replacer)

      return element
    } else {
      return 'COULD NOT RENDER WEB-COMPONENT'
    }
  }

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
    // dangerouslySetInnerHTML
    else if (p === 'dangerouslySetInnerHTML' && props[p].__html) {
      if (!isSSR()) {
        const fragment = document.createElement('fragment')
        fragment.innerHTML = props[p].__html
        element.appendChild(fragment)
      } else {
        element.innerHTML = props[p].__html
      }
    }
    // modern dangerouslySetInnerHTML
    else if (p === 'innerHTML' && props[p].__dangerousHtml) {
      if (!isSSR()) {
        const fragment = document.createElement('fragment')
        fragment.innerHTML = props[p].__dangerousHtml
        element.appendChild(fragment)
      } else {
        element.innerHTML = props[p].__dangerousHtml
      }
    }
    // className
    else if (/className/i.test(p)) console.warn('You can use "class" instead of "className".')
    // setAttribute
    else if (typeof props[p] !== 'undefined') element.setAttribute(p, props[p])
  }

  // these tags should not be escaped by default (in ssr)
  const escape = !['noscript', 'script', 'style'].includes(tagNameOrComponent)
  appendChildren(element, children, escape)

  if (ref) ref(element)
  return element as any
}
