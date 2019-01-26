
export const cleanUserData = user => {
  if (!user) return
  const { passwordHash, ...data } = user
  return data
}
