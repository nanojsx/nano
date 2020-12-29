// fixes an issue in std@0.80.0 (deno)
interface ReadableStream<R> {
  getIterator(): any
}
