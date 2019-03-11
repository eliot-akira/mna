import schema from '../base'
import email from './email'

const type = {

  any: () => null,
  
  required: value => typeof value==='undefined' || value===''
    ? schema.error.required
    : null
  ,

  string: value => schema.type.required(value) || (
    typeof value!=='string' ? schema.error.invalid
      : null
  ),

  number: value => schema.type.required(value) || (
    typeof value!=='number' ? schema.error.invalid
      : null
  ),

  array: value => schema.type.required(value) || (
    !Array.isArray(value) ? schema.error.invalid
      : null
  ),

  object: value => schema.type.required(value) || (
    typeof value!=='object' || Array.isArray(value)
      ? schema.error.invalid
      : null
  ),

  func: value => schema.type.required(value) || (
    typeof value!=='function' ? schema.error.invalid
      : null
  ),

  bool: value => schema.type.required(value) || (
    typeof value!=='boolean' ? schema.error.invalid
      : null
  ),

  arrayOf: givenType => value => {
    let error = schema.type.array(value)
    if (error) return error
    for (const val of value) {
      error = givenType(val)
      if (error) return error
    }
    return null
  },

  objectOf: shape => value =>
    schema.type.object(value)
    || Object.keys(shape).reduce((errors, key) => {
      const error = shape[key](value[key])
      if (error) {
        if (!errors) errors = {}
        errors[key] = error
      }
      return errors
    }, null)
  ,

  instanceOf: C => value => schema.type.required(value) || (
    !(value instanceof C) ? schema.error.invalid
      : null
  ), 

  allOf: (...givenTypes) => value => {
    let error = null
    for (const givenType of givenTypes) {
      error = givenType(value)
      if (error) break
    }
    return error
  },

  oneOf: (...givenTypes) => value => {
    for (const givenType of givenTypes) {
      const error = givenType(value)
      if (!error) return null
    }
    return schema.error.invalid
  },

  optional: givenType => value =>
    schema.type.required(value)===null
      ? givenType(value)
      : null
  ,

  email
}

export default type
