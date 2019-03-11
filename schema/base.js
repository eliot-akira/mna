export default function schema(fn) {
  return schema.type.objectOf(
    fn instanceof Function
      ? fn(schema.type)
      : fn
  )
}
