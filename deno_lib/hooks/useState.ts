import { _state } from '../state.ts'

export const useState = <T>(state: T, id: string): readonly [T, (state: T) => void] => {
  const s = {
    setState(state: T) {
      if (state !== null) _state.set(id, state)
    },
    get state(): T {
      return _state.get(id)
    }
  }

  if (!_state.has(id)) _state.set(id, state)

  return [s.state, s.setState]
}

export const getState = (id: string) => {
  return _state.get(id)
}

export const setState = (id: string, state: any) => {
  return _state.set(id, state)
}
