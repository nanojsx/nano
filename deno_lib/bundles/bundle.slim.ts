// core
import { h, render, tick } from '../core.ts'
import { task } from '../helpers.ts'

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
  jsx,
  render,
  tick,
  task,
  Component,
  Fragment,
  Store,
}

// version
export { printVersion } from '../helpers.ts'
export { VERSION } from '../version.ts'
