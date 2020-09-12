type State = any

export class Store {
  private _state: any
  private _prevState: any
  private _listeners: Map<string, Function> = new Map()
  private _storage: 'memory' | 'local' | 'session'
  private _id: string

  /**
   * Create your own Store.
   * @param defaultState Pass the initial State.
   * @param name The name of the Store (only required if you persist the state in localStorage or sessionStorage).
   * @param storage Pass 'memory', 'local' or 'session'.
   */
  constructor(defaultState: Object, name: string = '', storage: 'memory' | 'local' | 'session' = 'memory') {
    this._id = name
    this._storage = storage

    this._state = this._prevState = defaultState as any

    if (storage === 'memory' || !storage) return

    const Storage = storage === 'local' ? localStorage : sessionStorage

    // get/set initial state of Storage
    const item = Storage.getItem(this._id)
    if (item) {
      this._state = this._prevState = JSON.parse(item)
    } else Storage.setItem(this._id, JSON.stringify(defaultState))
  }

  private persist(newState: any) {
    if (this._storage === 'memory') return
    const Storage = this._storage === 'local' ? localStorage : sessionStorage
    Storage.setItem(this._id, JSON.stringify(newState))
  }

  public setState(newState: any) {
    this.state = newState
  }

  public set state(newState: any) {
    this._prevState = this._state
    this._state = newState

    this.persist(newState)

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
