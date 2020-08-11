// core
import { h, render, hydrate, tick } from '../core.ts'
import { hydrateLazy } from '../lazy.ts'

// useful tools
import { Component } from '../component.ts'
import { Fragment } from '../fragment.ts'
import { Store } from '../store.ts'
import { createContext } from '../context.ts'

// tagged templates
import { jsx } from '../jsx.ts'

export default {
  createContext,
  h,
  hydrate,
  hydrateLazy,
  jsx,
  render,
  tick,
  Component,
  Fragment,
  Store,
}
