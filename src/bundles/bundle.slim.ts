// core
import { h, render, tick } from '../core'
import { task } from '../helpers'

// useful tools
import { Component } from '../component'
import { Fragment } from '../fragment'
import { Store } from '../store'
import { createContext } from '../context'
import { withStyles } from '../withStyles'
import * as Router from '../components/router'

// tagged templates
import { jsx } from '../jsx'

export default {
  Component,
  Fragment,
  Router,
  Store,
  createContext,
  h,
  jsx,
  render,
  task,
  tick,
  withStyles
}

// version
export { printVersion } from '../helpers'
export { VERSION } from '../version'
