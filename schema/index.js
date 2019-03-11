import schema from './base'
import error from './error'
import type from './type'

schema.error = error
schema.type = type

// Returns null if valid, or object of keys with errors
schema.validate = (value, shape) =>
  shape instanceof Function
    ? shape(value)
    : schema.type.object(shape)(value)

// Returns true if valid
schema.valid = (value, shape) => schema.validate(value, shape)===null

export default schema
