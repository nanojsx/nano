import { isSSR } from './core.ts'

export class Store<S = any> {
  private _state: S
  private _prevState: S
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
    if (isSSR()) storage = 'memory'

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

  private persist(newState: S) {
    if (this._storage === 'memory') return
    const Storage = this._storage === 'local' ? localStorage : sessionStorage
    Storage.setItem(this._id, JSON.stringify(newState))
  }

  /** Clears the state of the whole store. */
  public clear() {
    // @ts-ignore
    this._state = this._prevState = undefined

    if (this._storage === 'local') localStorage.removeItem(this._id)
    else if (this._storage === 'session') sessionStorage.removeItem(this._id)
  }

  public setState(newState: S) {
    this.state = newState
  }

  public set state(newState: S) {
    this._prevState = this._state
    this._state = newState

    this.persist(newState)

    this._listeners.forEach(fnc => {
      fnc(this._state, this._prevState)
    })
  }

  public get state(): S {
    return this._state
  }

  public use() {
    const id = Math.random().toString(36).substring(2, 9)
    const _this = this
    return {
      get state(): S {
        return _this.state
      },
      setState: (newState: S) => {
        this.state = newState
      },
      subscribe: (fnc: (newState: S, prevState: S) => void) => {
        this._listeners.set(id, fnc)
      },
      cancel: () => {
        if (this._listeners.has(id)) this._listeners.delete(id)
      }
    }
  }
}
