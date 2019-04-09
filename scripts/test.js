module.exports = () => {

  require('../builder/scripts/test')({
    alias: { '@mna': process.cwd }
  })

}
