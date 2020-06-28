import { createElement, render, removeAllChildNodes } from '../core'
import { Fragment, createContext, nodeToString } from '../helpers'
import { Component } from '../component'
import { Link } from '../components/link'
import { Img } from '../components/img'
import { Visible } from '../components/visible'

export default {
  Nano: { createContext, createElement, render, removeAllChildNodes, nodeToString },
  Fragment,
  Component,
  Link,
  Img,
  Visible,
}
