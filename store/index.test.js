import createStore from './index'

test('Store', async it => {

  const store = createStore({
    createState: () => ({
      count: 1
    }),
    actions: {
      plus({ state, setState }) {
        setState({
          count: state.count+1
        })
      },
      plusChild({ actions }) {
        actions.child.plus()
      }
    },
    stores: {
      child: {
        createState: () => ({
          count: 1
        }),
        actions: {
          plus({ state, setState }) {
            setState({
              count: state.count+1
            })
          }
        },
      }
    }
  })

  it('Creates a store', store)
  it('Has initial state', store.getState().count===1)

  store.plus()

  it('Updates after action', store.getState().count===2)

  it('Creates a child store', store.child)

  it('Has initial child state', store.getState().child.count===1)

  it('Has child actions', store.child.plus)

  await new Promise((resolve, reject) => {

    store.once('setState', () => {
      it('Child action emits parent setState', true)
      it('Child action updates parent state', store.getState().child.count===2)
      it('Child action updates child state', store.child.getState().count===2)
      it('Child state references the same object in parent state', store.child.getState()===store.getState().child)
      resolve()
    })

    store.child.plus()
  })

  store.plusChild()

  it('Parent action can run child actions', store.getState().child.count===3)
})
