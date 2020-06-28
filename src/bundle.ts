import { createElement, render, removeAllChildNodes } from './core'
import { Fragment, createContext, nodeToString } from './helpers'
import { Component } from './component'
import { Link } from './link'

export default {
  Nano: { createContext, createElement, render, removeAllChildNodes, nodeToString },
  Fragment,
  Component,
  Link,
}
