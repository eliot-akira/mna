const ts = require('typescript')

module.exports = ts /*function(args = []) {

  const options = {
    rootDir: tmpSrc,
    lib: 'es6',
    jsx: 'react',
    allowSyntheticDefaultImports: true,
    declaration: true,
    declarationDir: '.',
    emitDeclarationOnly: true,
  }

  const compilerHost = ts.createCompilerHost(options)
  const program = ts.createProgram(tsFiles.map(f => path.join(tmpSrc, f)), options, compilerHost)
  const emitResult = program.emit()

} */
