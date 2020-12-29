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
import { logVersion } from '../helpers.ts'
logVersion()
