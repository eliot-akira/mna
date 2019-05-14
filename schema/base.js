const schema = fn => {

  const v = fn instanceof Function
    ? fn(schema.type)
    : fn

  return v instanceof Function
    ? v
    : schema.type.objectOf(v)
}

schema.async = fn => {

  const v = fn instanceof Function
    ? fn(schema.type)
    : fn

  return v instanceof Function
    ? v
    : schema.type.objectOf.async(v)
}

export default schema
