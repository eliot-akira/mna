import Layout from './index'

export default (props) => <Layout {...{
  type: 'with-sidebar',
  ...props
}} />