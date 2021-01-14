// core
import { h, render, tick } from '../core'
import { task } from '../helpers'

// useful tools
import { Component } from '../component'
import { Fragment } from '../fragment'
import { Store } from '../store'
import { createContext } from '../context'

// tagged templates
import { jsx } from '../jsx'

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
export { printVersion } from '../helpers'
export { VERSION } from '../version'
