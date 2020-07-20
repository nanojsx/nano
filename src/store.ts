type State = any

export class Store {
  private _state: any
  private _prevState: any
  private _listeners: Map<string, Function> = new Map()

  constructor(defaultState: Object) {
    this._state = defaultState as any
    this._prevState = defaultState as any
  }

  public set state(newState: any) {
    this._prevState = this._state
    this._state = newState
    this._listeners.forEach((fnc) => {
      fnc(this._state, this._prevState)
    })
  }

  public get state(): State {
    return this._state
  }

  public use() {
    const id = Math.random().toString(36).substr(2, 9)
    const _this = this
    return {
      get state(): State {
        return _this.state
      },
      setState: (newState: State) => {
        this.state = newState
      },
      subscribe: (fnc: (newState: State, prevState: State) => void) => {
        this._listeners.set(id, fnc)
      },
      cancel: () => {
        this._listeners.delete(id)
      },
    }
  }
}
