export interface Store {
  state: {
    [propName: string]: any
  },
  actions: {
    [propName: string]: (...args: any[]) => any
  }
}
