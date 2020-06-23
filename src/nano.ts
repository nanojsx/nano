export const Fragment = (props: any) => {
  return props.children
}

export const removeAllChildNodes = (parent: HTMLElement) => {
  while (parent.firstChild) {
    parent.removeChild(parent.firstChild)
  }
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

export const render = (component: any, parent: HTMLElement | null = null, removeChildNodes = true) => {
  let el = renderComponent(component)

  if (!!parent) {
    if (removeChildNodes) removeAllChildNodes(parent)

    // append element(s) to the parent
    if (Array.isArray(el)) {
      el.forEach((e) => {
        parent.appendChild(renderComponent(e))
      })
    } else {
      parent.appendChild(el)
    }
  }

  return el
}

export const renderComponent = (componentP: { component: any; props?: any }): any => {
  let el
  let props = { children: [] }
  let component = componentP as any

  // @ts-ignore // if it is already a jsx element, simply return it
  if (componentP.tagName) {
    return componentP
  }

  if (componentP?.component) component = componentP.component
  if (componentP?.props) props = componentP.props

  // TODO(yandeu) This looks very unsafe, is there a better way to detect if it is a function or class?
  // does only work in > ES2015
  const isClass = (fn: any) => /^class/.test(fn?.toString())

  if (isClass(component)) {
    const c = new component()
    // apply props
    c.props = props

    c.willMount?.()

    c.element = c.render()
    el = c.element

    if (!el.tagName) {
      el = renderComponent(el)
    }

    if (c.didMount) setTimeout(() => c.didMount(), 0)
  } else {
    if (typeof component === 'function') el = component(props)
    else el = component

    // for the fragment
    if (Array.isArray(el)) return el

    if (el && !el.tagName) {
      el = renderComponent(el)
    }
  }

  if (typeof el === 'undefined') {
    console.warn('Do all classes extend Component?')
    throw new Error()
  }
  return el
}

// https://stackoverflow.com/a/42405694/12656855
export const createElement = (tagNameOrComponent: any, props: any = {}, ...children: any) => {
  // if tagNameOrComponent is a component
  if (typeof tagNameOrComponent !== 'string') {
    const p = { ...props, children: children }
    return { component: tagNameOrComponent, props: p }
  }

  const element = document.createElement(tagNameOrComponent) as HTMLElement
  let ref

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

  const append = (child: any) => {
    element.appendChild(child.nodeType == null ? document.createTextNode(child.toString()) : child)
  }

  const appendChild = (child: HTMLElement) => {
    // @ts-ignore
    if (child.component) child = renderComponent(child)

    if (Array.isArray(child)) {
      child.forEach((c) => {
        if (c.component) c = renderComponent(c)
        append(c)
      })
    } else append(child)
  }

  const renderAndAppend = (args: any) => {
    args.forEach((arg: any) => {
      if (Array.isArray(arg)) {
        arg.forEach((child: any) => {
          appendChild(child)
        })
      } else {
        let child = renderComponent(arg) as HTMLElement
        if (Array.isArray(child)) {
          child.forEach((c) => {
            appendChild(c)
          })
        } else {
          appendChild(child)
        }
      }
    })
  }

  renderAndAppend(children)

  if (ref) ref(element)
  return element
}
