import { cleanUserData } from './utils'

const log = (...args) => console.log('@mna/content/user/typeActions', ...args)

async function hashAndDiscardPassword(auth, data) {
  data.passwordHash = await auth.createHash(data.password)
  delete data.password // Important
  return data
}

export async function create({ auth, store, data }) {

  data = await hashAndDiscardPassword(auth, data)

  const result = await store.create(data)

  //log('CREATED', result)

  return { result }
}

export async function find({ store, data }) {

  const result = await store.find(data)

  //log('FOUND', result)

  return { result }
}

export async function findOne({ store, data }) {

  const result = await store.findOne(data)

  //log('FOUND ONE', result)

  return { result }
}

export async function update({ auth, store, data }) {

  if (!data.id) throw { message: 'Requires ID' }

  //log('UPDATE', data)

  if (data.password) {
    data = await hashAndDiscardPassword(auth, data)
  }

  const result = await store.update(data)

  //log('UPDATED', result)

  return { result }
}

export async function remove({ store, data }) {

  const result = await store.remove(data)

  //log('REMOVED', result)

  return { result }
}

export async function login({ auth, store, data, req, res }) {

  const { name, password } = data
  const user = await store.findOne({ name })

  if (!user || !await auth.compareHash(password, user.passwordHash)) {
    throw { message: 'Login failed' }
  }

  //log('LOGIN', data, user)

  await auth.login(req, res, user)

  return {
    message: 'Login success',
    result: cleanUserData(user)
  }
}

export async function logout({ auth, store, data, res }) {

  await auth.logout(res)

  //log('LOGOUT', data)

  return { message: 'Logout success' }
}

export async function register({ auth, store, data, res }) {

  // Create user and redirect?

  //log('REGISTER', data)
}
