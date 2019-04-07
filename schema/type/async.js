import schema from '../base'

export default (type) => {

  type.objectOf.async = shape => async (value) => {
  
    let errors = type.object(value)
    if (errors) return errors

    for (const key in shape) {
      const error = await shape[key](value[key])
      if (error) {
        if (!errors) errors = {}
        errors[key] = error
      }
    }

    return errors
  }

  type.arrayOf.async = (givenType, strict = false) => async (value) => {

    let error = schema.type.array(value)
    if (error) return error

    for (const val of value) {
      error = await givenType(val)
      if (error) return error
      // Only check first element by default
      if (!strict) break
    }
    return null
  }

  type.strictArrayOf.async = givenType => type.arrayOf.async(givenType, true),

  type.allOf.async = (...givenTypes) => async (value) => {
    let error = null
    for (const givenType of givenTypes) {
      error = await givenType(value)
      if (error) break
    }
    return error
  }

  type.oneOf.async = (...givenTypes) => async (value) => {
    for (const givenType of givenTypes) {
      const error = await givenType(value)
      if (!error) return null
    }
    return schema.error.invalid
  }

  return type
}
