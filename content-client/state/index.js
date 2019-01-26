
// Content state and actions used on client side

import api from '@mna/api'
import { deleteCookie } from '@mna/dom/cookie'

export const createState = () => ({
  content: {},
  user: null
})

export const actions = {

  api: ({ type, action, data }) => api.post('/api', {
    type,
    action,
    data
  }),

  login: ({ data, setState }) => api.post('/api', {
    type: 'user',
    action: 'login',
    data
  })
    .then(res => {
      if (res.result) {
        setState({ user: res.result })
        return res.result
      }
    })
    .catch(e => {
      console.log('Login fail', e)
    })
  ,

  logout: ({ setState }) => api.post('/api', {
    type: 'user',
    action: 'logout'
  })
    .then(res => {
      setState({ user: null })
      deleteCookie('jwt')
    })
    .catch(e => {
      console.log('Logout fail', e)
      setState({ user: null })
      deleteCookie('jwt')
    })
  ,

  updateUser: ({ data, state, setState }) => api.post('/api', {
    type: 'user',
    action: 'update',
    data: {
      id: state.user && state.user.id,
      ...data
    }
  })
    .then(res => {
      const { id, password, ...user } = data
      setState({ user: {
        ...state.user,
        ...user
      } })
      return true
    })
    .catch(e => {
      console.log('Update user fail', e)
    })
  ,
}