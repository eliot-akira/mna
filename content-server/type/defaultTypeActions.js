
const log = (...args) => console.log('@mna/content/type/defaultTypeAction', ...args)

const defaultTypeActions = {
  async create({ store, data }) {
    return await store.create(data)
  },
  async find({ store, data }) {
    return await store.find(data)
  },
  async findOne({ store, data }) {
    return await store.findOne(data)
  },
  async update({ store, data }) {
    return await store.update(data)
  },
  async remove({ store, data }) {
    return await store.remove(data)
  }
}

module.exports = defaultTypeActions