import { _state } from '../state'

export const useState = <T>(
  state: T,
  id: string
): readonly [T, (state: T) => void, (id: string) => T, (cb: (state: T) => void) => void] => {
  let c: (state: T) => void = _ => {}

  const s = {
    get state(): T {
      return _state.get(id)
    },
    setState(state: T) {
      if (state !== null) {
        _state.set(id, state)
        c(state)
      }
    },
    getState(id: string): T {
      return _state.get(id)
    },
    listener(cb: (state: T) => void) {
      c = cb
    }
  }

  if (!_state.has(id)) _state.set(id, state)

  return [s.state, s.setState, s.getState, s.listener]
}

export const getState = (id: string) => {
  return _state.get(id)
}

export const setState = (id: string, state: any) => {
  return _state.set(id, state)
}
