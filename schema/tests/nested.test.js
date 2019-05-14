import schema from '../index'

test('Schema: Nested', it => {

  const childSchema = schema(({ string }) => ({
    key: string
  }))

  const parentSchema = schema(() => ({
    child: childSchema
  }))

  let errors = parentSchema({
    child: { key: 'value' }
  })

  it('handles parent with valid child schema', !errors)

  errors = parentSchema({
    child: 'true'
  })

  it('handles parent with invalid child schema', errors.child)

})
