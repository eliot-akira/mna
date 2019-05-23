const schema = (fn, isAsync) => {

  const v = fn instanceof Function
    ? fn(schema.type)
    : fn

  return v instanceof Function
    ? v
    : (isAsync
      ? schema.type.objectOf.async(v)
      : schema.type.objectOf(v)
    )
}

schema.async = fn => schema(fn, true)

export default schema
