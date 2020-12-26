declare const isSSR: boolean

import { render } from './core'
import { _state } from './state'

const initSSR = (pathname: string) => {
  // @ts-ignore
  const isDeno = typeof Deno !== 'undefined'
  const hasWindow = typeof window !== 'undefined' && window.document ? true : false
  const _isSSR = (typeof isSSR !== 'undefined' && isSSR) || isDeno || !hasWindow

  // @ts-ignore
  globalThis.isSSR = _isSSR
  // @ts-ignore
  globalThis.window = _isSSR ? { location: { pathname } } : window
  // @ts-ignore
  globalThis.document = _isSSR ? new DocumentSSR() : window.document
}

export const clearState = () => {
  _state.clear()
}

export const renderSSR = (component: any, options: { pathname?: string; clearState?: boolean } = {}) => {
  const { pathname = '/', clearState = true } = options

  initSSR(pathname)
  if (clearState) _state.clear()

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
    const reg = /(^<[a-z]+>)([\s\S]*)(<\/[a-z]+>$)/gm
    return reg.exec(this.ssr)?.[2] ?? ''
  }

  get innerText() {
    const reg = /(^<[^>]+>)(.+)?(<\/[a-z]+>$|\/>$)/gm
    return reg.exec(this.ssr)?.[2] ?? ''
  }

  set innerText(text) {
    const reg = /(^<[^>]+>)(.+)?(<\/[a-z]+>$|\/>$)/gm
    this.ssr = this.ssr.replace(reg, `$1${text}$3`)
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

  replaceChild(newChild: any, _oldChild: any) {
    this.innerText = newChild.ssr
  }

  get children() {
    const reg = /<([a-z]+)((?!<\/\1).)*<\/\1>/gms

    const array = []

    let match

    while ((match = reg.exec(this.innerHTML)) !== null) {
      array.push(match[0].replace(/[\s]+/gm, ' '))
    }

    return array
  }

  addEventListener(_type: any, _listener: any, _options: any) {}
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

  createElementNS(_URI: string, tag: string) {
    return new HTMLElementSSR(tag)
  }

  createTextNode(text: string) {
    return text
  }

  querySelector(_query: any) {
    return undefined
  }
}
