
const withProps = transform => C =>
  props => <C {...{
    ...props,
    ...(transform(props) || {})
  }}/>

export default withProps
