import Layout from './index'

export default (props) => <Layout {...{
  ...props,
  type: 'with-sidebar'
}} />