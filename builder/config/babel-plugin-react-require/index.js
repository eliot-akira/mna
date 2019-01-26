module.exports = function ({ types: t }) {
  return {
    visitor: {
      Program: {
        enter(path, { file }) {
          const ourNode = t.importDeclaration([
            t.importDefaultSpecifier(t.identifier('React')),
          ], t.stringLiteral('react'))

          // Add an import early, so that other plugins get to see it
          file.set('reactRequirePath', path.unshiftContainer('body', ourNode)[0])
        },

        exit(_, { file }) {
          // If our import is still intact and we haven't encountered any JSX in
          // the program, then we just remove it. There's an edge case, where
          // some other plugin could add JSX in its `Program.exit`, so our
          // `JSXOpeningElement` will trigger only after this method, but it's
          // likely that said plugin will also add a React import too.
          const reactRequirePath = file.get('reactRequirePath')
          if (reactRequirePath && !file.get('hasJSX')) {
            if (!reactRequirePath.removed) reactRequirePath.remove()
            file.set('reactRequirePath', undefined)
          }
        },
      },

      ImportDeclaration(path, { file }) {
        // Return early if this has nothing to do with React
        if (path.node.specifiers.every(x => x.local.name !== 'React')) return

        // If our import is still intact and we encounter some other import
        // which also imports `React`, then we remove ours.
        const reactRequirePath = file.get('reactRequirePath')
        if (reactRequirePath && path !== reactRequirePath) {
          if (!reactRequirePath.removed) reactRequirePath.remove()
          file.set('reactRequirePath', undefined)
        }
      },

      JSXOpeningElement(_, { file }) {
        file.set('hasJSX', true)
      },

      JSXOpeningFragment(_, { file }) {
        file.set('hasJSX', true)
      }
    },
  }
}