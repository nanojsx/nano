import { Component } from '../component'
import { appendChildren, h } from '../core'

export class Helmet extends Component {
  static SSR(body: string) {
    const reg = /(<helmet\b[^>]*>)(.*?)(<\/helmet>)/gms

    // collect all headers
    let head = []

    let result
    while ((result = reg.exec(body)) !== null) {
      const res = result[2]
      // ignore if the same element already exists
      if (head.indexOf(res) === -1) head.push(res)
    }

    // remove all matches
    const cleaned = body.replace(reg, '')
    return { body: cleaned, head }
  }

  didMount() {
    this.props.children.forEach((element: HTMLElement) => {
      let tag = element.tagName
      let attrs: string[] = []

      // get all attributes
      for (let attr = 0; attr < element.attributes.length; attr++) {
        attrs.push(element.attributes.item(attr)?.name.toLowerCase() as string)
        attrs.push(element.attributes.item(attr)?.value.toLowerCase() as string)
      }

      // handle special tags
      if (tag === 'HTML' || tag === 'BODY') {
        const htmlTag = document.getElementsByTagName(tag)[0]
        for (let attr = 0; attr < attrs.length; attr += 2) {
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
          document.head.appendChild(titleTag)
        }
        return
      }

      // check if the element exists already
      let exists = false
      attrs = attrs.sort()
      const el = document.getElementsByTagName(tag)

      for (let i = 0; i < el.length; i++) {
        let attrs2: string[] = []
        for (let attr = 0; attr < el[i].attributes.length; attr++) {
          attrs2.push(el[i].attributes.item(attr)?.name.toLowerCase() as string)
          attrs2.push(el[i].attributes.item(attr)?.value.toLowerCase() as string)
        }
        attrs2 = attrs2.sort()

        if (JSON.stringify(attrs) === JSON.stringify(attrs2)) exists = true
      }

      // add to dom
      if (!exists) appendChildren(document.head, element)
    })
  }

  render() {
    const isSSR = !(typeof window !== 'undefined' && window.document)

    if (isSSR) return h('helmet', { 'data-ssr': true }, this.props.children)
    else return [] as any
  }
}
