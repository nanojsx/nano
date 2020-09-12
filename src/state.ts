/** Holds the state of the whole application. */
export const _state: Map<string, any> = new Map()

/** Clears the state of the whole application. */
export const _clearState = () => {
  _state.clear()
}
