function schema(fn) {
  return schema.type.objectOf(
    fn instanceof Function
      ? fn(schema.type)
      : fn
  )
}

schema.async = fn => schema.type.objectOf.async(
  fn instanceof Function
    ? fn(schema.type)
    : fn
)

export default schema
