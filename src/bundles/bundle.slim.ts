// core
import { h, render, hydrate, tick } from '../core'
import { hydrateLazy } from '../lazy'

// useful tools
import { Component } from '../component'
import { Fragment } from '../fragment'
import { Store } from '../store'
import { createContext } from '../context'

// tagged templates
//@ts-ignore
import htm from '../htm'
const jsx = htm.bind(h)

export default {
  h,
  render,
  hydrate,
  tick,
  createContext,
  Component,
  Fragment,
  Store,
  jsx,
  hydrateLazy,
}
