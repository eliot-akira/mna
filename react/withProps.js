
const withProps = transform => C =>
  props => <C {...transform(props)}/>

export default withProps