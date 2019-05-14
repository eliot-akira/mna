
export default function getPermissionProps({
  type, action, data,
  types, user, permissions = [],
}) {

  const { role: userRole = [] } = user || {}

  let isAllowed = !permissions.length || userRole.includes('admin')
  let checkSelf

  for (const p of permissions) {

    // PermissionDefinition: string | PermissionDefinitionObject
    const { role, actions } = typeof p==='string' ? { role: p } : p

    if (role==='self') {

      // The action should call this if defined, typically with a user/author ID of a database item
      checkSelf = userId => user && user.id===userId && (
        !actions || actions.includes(action)
      )
    }

    if (!userRole.includes(role)) continue

    if (!actions || actions.includes(action)) {
      isAllowed = true
      break
    }
  }

  if (isAllowed) {

    // Some role other than 'self' matched
    checkSelf = false

  } else if (checkSelf) {

    // Always allow getting data, so user ID can be checked
    isAllowed = true
  }

  return { isAllowed, checkSelf }
}
