import { render } from './core.ts'

const initSSR = () => {
  // @ts-ignore
  globalThis.isSSR = !(typeof window !== 'undefined' && window.document)
  // @ts-ignore
  globalThis.document = isSSR ? new DocumentSSR() : window.document
}

export const renderSSR = (component: any) => {
  initSSR()
  return render(component, null, true).join('') as string
}

export class HTMLElementSSR {
  ssr: string
  tagName: string
  isSelfClosing: boolean = false

  constructor(tag: string) {
    this.tagName = tag

    const selfClosing = [
      'area',
      'base',
      'br',
      'col',
      'embed',
      'hr',
      'img',
      'input',
      'link',
      'meta',
      'param',
      'source',
      'track',
      'wbr',
    ]

    if (selfClosing.indexOf(tag) >= 0) {
      this.ssr = `<${tag} />`
      this.isSelfClosing = true
    } else {
      this.ssr = `<${tag}></${tag}>`
    }
  }

  get outerHTML() {
    return this.innerText
  }

  get innerHTML() {
    return 'TODO'
  }

  get innerText() {
    // @ts-ignore
    return /(^<[^>]+>)(.+)?(<\/[a-z]+>$|\/>$)/gm.exec(this.ssr)[2]
  }

  set innerText(text) {
    this.ssr = this.ssr.replace(/(^<[^>]+>)(.+)?(<\/[a-z]+>$|\/>$)/gm, `$1${text}$3`)
  }

  get attributes() {
    return { length: 1 }
  }

  setAttributeNS(name: string, value: any) {
    this.setAttribute(name, value)
  }

  setAttribute(name: string, value: any) {
    if (this.isSelfClosing) this.ssr = this.ssr.replace(/(^<[a-z]+ )(.+)/gm, `$1${name}="${value}" $2`)
    else this.ssr = this.ssr.replace(/(^<[^>]+)(.+)/gm, `$1 ${name}="${value}"$2`)
  }

  appendChild(child: any) {
    const append = child.ssr ? child.ssr : child

    const index = this.ssr.lastIndexOf('</')

    this.ssr = this.ssr.substring(0, index) + append + this.ssr.substring(index)
  }

  // @ts-ignore
  replaceChild(newChild: any, oldChild: any) {
    this.innerText = newChild.ssr
  }

  // @ts-ignore
  addEventListener(type: any, listener: any, options: any) {}
}

export class DocumentSSR {
  body: HTMLElementSSR
  head: HTMLElementSSR

  constructor() {
    this.body = this.createElement('body')
    this.head = this.createElement('head')
  }

  createElement(tag: string) {
    return new HTMLElementSSR(tag)
  }

  // @ts-ignore
  createElementNS(URI: string, tag: string) {
    return new HTMLElementSSR(tag)
  }

  createTextNode(text: string) {
    return text
  }
}
