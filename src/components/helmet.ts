import { Component } from '../component'
import { appendChildren, h, isSSR } from '../core'

class Attributes extends Map {
  toString() {
    let string = ''
    for (const [key, value] of this) string += ` ${key}="${value}"`
    return string.trim()
  }
}

export class Helmet extends Component {
  static SSR(body: string) {
    const reg = /(<helmet\b[^>]*>)((.|\r\n|\n|\r)*?)(<\/helmet>)/gm

    // collect all elements
    const head: HTMLElement[] = []
    const footer: HTMLElement[] = []
    const attributes = {
      html: new Attributes(),
      body: new Attributes()
    }

    // get what's in the head
    if (typeof document !== 'undefined' && document.head) {
      let children: HTMLElement[] = []
      children = [].slice.call(document.head.children)
      for (let i = 0; i < children.length; i++) {
        // check if the same element already exists
        if (head.indexOf(children[i]) === -1) {
          head.push(children[i])
        }
      }
    }

    let result!: any
    while ((result = reg.exec(body)) !== null) {
      const first = result[1]
      let second = result[2]

      const regHTML = /<html\s([^>]+)><\/html>/gm
      const regBody = /<body\s([^>]+)><\/body>/gm
      const regAttr = /(\w+)="([^"]+)"/gm
      let res = null

      // extract html attributes
      body.match(regHTML)?.forEach(h => {
        second = second.replace(h, '')
        while ((res = regAttr.exec(h)) !== null) {
          attributes.html.set(res[1], res[2])
        }
      })
      // extract body attributes
      body.match(regBody)?.forEach(b => {
        second = second.replace(b, '')
        while ((res = regAttr.exec(b)) !== null) {
          attributes.body.set(res[1], res[2])
        }
      })

      const toHead = first.includes('data-placement="head"')

      // do not add an element if it already exists
      if (toHead && !head.includes(second)) head.push(second)
      else if (!toHead && !footer.includes(second)) footer.push(second)
    }

    // clean the body from all matches
    const cleanBody = body.replace(reg, '')
    return {
      body: cleanBody,
      head: head as unknown as string[],
      footer: footer as unknown as string[],
      attributes
    }
  }

  didMount() {
    this.props.children.forEach((element: HTMLElement) => {
      // return if it is not an html element
      if (!(element instanceof HTMLElement)) return

      const parent = this.props.footer ? document.body : document.head
      const tag = element.tagName
      let attrs: string[] = []

      // get the inner text
      attrs.push(element.innerText as string)

      // get all attributes
      for (let attr = 0; attr < element.attributes.length; attr++) {
        attrs.push(element.attributes.item(attr)?.name.toLowerCase() as string)
        attrs.push(element.attributes.item(attr)?.value.toLowerCase() as string)
      }

      // handle special tags
      if (tag === 'HTML' || tag === 'BODY') {
        const htmlTag = document.getElementsByTagName(tag)[0]
        for (let attr = 1; attr < attrs.length; attr += 2) {
          htmlTag.setAttribute(attrs[attr], attrs[attr + 1])
        }
        return
      } else if (tag === 'TITLE') {
        const titleTags = document.getElementsByTagName('TITLE') as HTMLCollectionOf<HTMLTitleElement>
        if (titleTags.length > 0) {
          const e = element as HTMLTitleElement
          titleTags[0].text = e.text
        } else {
          const titleTag = h('title', null, element.innerHTML) as HTMLTitleElement
          appendChildren(parent, [titleTag], false)
        }
        return
      }

      // check if the element already exists
      let exists = false
      attrs = attrs.sort()

      const el = document.getElementsByTagName(tag) as unknown as HTMLElement[]

      for (let i = 0; i < el.length; i++) {
        let attrs2: string[] = []

        // get the inner text
        attrs2.push(el[i].innerText as string)

        for (let attr = 0; attr < el[i].attributes.length; attr++) {
          attrs2.push(el[i].attributes.item(attr)?.name.toLowerCase() as string)
          attrs2.push(el[i].attributes.item(attr)?.value.toLowerCase() as string)
        }
        attrs2 = attrs2.sort()

        if (attrs.length > 0 && attrs2.length > 0 && JSON.stringify(attrs) === JSON.stringify(attrs2)) exists = true
      }

      // add to dom
      if (!exists) appendChildren(parent, [element], false)
    })
  }

  render() {
    const placement = this.props.footer ? 'footer' : 'head'

    if (isSSR()) return h('helmet', { 'data-ssr': true, 'data-placement': placement }, this.props.children)
    else return []
  }
}
