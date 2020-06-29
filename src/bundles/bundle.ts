import { createElement, render, removeAllChildNodes } from '../core'
import { Fragment, createContext, nodeToString } from '../helpers'
import { Component } from '../component'
import { Helmet } from '../components/helmet'
import { Link } from '../components/link'
import { Img } from '../components/img'
import { Visible } from '../components/visible'

// @ts-ignore
import htm from 'htm/dist/htm.js'
const jsx = htm.bind(createElement)

export default {
  Nano: { createContext, createElement, render, removeAllChildNodes, nodeToString },
  Fragment,
  Component,
  Helmet,
  Link,
  Img,
  Visible,
  jsx,
}
