import { Component } from '../component'
import { appendChildren, h } from '../core'
import { isSSR } from '../helpers'

export class Helmet extends Component {
  static SSR(body: string) {
    const reg = /(<helmet\b[^>]*>)((.|\n)*?)(<\/helmet>)/gm

    // collect all elements
    let head: string[] = []
    let footer: string[] = []

    // get what's in the head
    if (typeof document !== 'undefined' && document.head) {
      let children: string[] = []
      // @ts-ignore
      children = document.head.children
      for (let i = 0; i < children.length; i++) {
        // check if the same element already exists
        if (head.indexOf(children[i]) === -1) {
          head.push(children[i])
        }
      }
    }

    let result
    while ((result = reg.exec(body)) !== null) {
      const first = result[1]
      const second = result[2]

      const toHead = first.includes('data-placement="head"')

      // do not add an element if it already exists
      if (toHead && !head.includes(second)) head.push(second)
      else if (!footer.includes(second)) footer.push(second)
    }

    // clean the body from all matches
    const cleanBody = body.replace(reg, '')
    return { body: cleanBody, head, footer }
  }

  didMount() {
    this.props.children.forEach((element: HTMLElement) => {
      let parent = this.props.footer ? document.body : document.head
      let tag = element.tagName
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
          let e = element as HTMLTitleElement
          titleTags[0].text = e.text
        } else {
          let titleTag = h('title', null, element.innerHTML) as HTMLTitleElement
          parent.appendChild(titleTag)
        }
        return
      }

      // check if the element already exists
      let exists = false
      attrs = attrs.sort()

      const el: HTMLElement[] = document.getElementsByTagName(tag) as any

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
      if (!exists) appendChildren(parent, element)
    })
  }

  render() {
    const placement = this.props.footer ? 'footer' : 'head'

    if (isSSR) return h('helmet', { 'data-ssr': true, 'data-placement': placement }, this.props.children)
    else return [] as any
  }
}
