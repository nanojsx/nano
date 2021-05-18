import { _state } from '../state.ts'

export const useState = (state: any, id: string) => {
  const s = {
    setState(state: any) {
      if (state !== null) _state.set(id, state)
    },
    get state() {
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
