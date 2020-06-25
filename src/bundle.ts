import { Fragment, createContext, createElement, render, removeAllChildNodes, nodeToString } from './nano'
import { Component } from './component'
import { Link } from './link'

export default {
  Nano: { createContext, createElement, render, removeAllChildNodes, nodeToString },
  Fragment,
  Component,
  Link,
}
