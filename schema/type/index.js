import schema from '../base'
import email from './email'
import withAsync from './async'

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

  obj: value => schema.type.required(value) || (
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

  instanceOf: C => value => schema.type.required(value) || (
    !(value instanceof C) ? schema.error.invalid
      : null
  ),

  optional: givenType => value =>
    schema.type.required(value)===null
      ? givenType(value)
      : null
  ,

  is: givenValue => value => schema.type.required(value) || (
    givenValue===value ? null : schema.error.invalid
  ),

  stringOf: givenValue =>
    Array.isArray(givenValue)
      ? (value => schema.type.required(value) || (
        givenValue.includes(value) ? null : schema.error.invalid
      ))
      : schema.type.is(givenValue)
  ,

  // Following types have async versions

  arrayOf: (givenType, strict = false) => value => {
    let error = schema.type.array(value)
    if (error) return error
    for (const val of value) {
      error = givenType(val)
      if (error) return error
      // Only check first element by default
      if (!strict) break
    }
    return null
  },

  strictArrayOf: givenType => schema.type.arrayOf(givenType, true),

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

  email
}

// Aliases

type.object = type.obj
type.function = type.func
type.boolean = type.bool

export default withAsync(type)
