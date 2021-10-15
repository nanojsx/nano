// fixes an issue in std@0.80.0 (deno)
interface ReadableStream<R> {
  getIterator(): any
}

declare var isSSR: boolean | undefined;
declare var _nano: any;
declare const Deno: any

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
