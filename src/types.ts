declare namespace JSX {
  interface IntrinsicElements {
    [elemName: string]: any
  }
  interface ElementClass {
    render: any
  }
  interface ElementChildrenAttribute {
    children: any;
  }
}
