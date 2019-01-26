
const Select = ({ options, ...selectProps }) =>
  <select {...selectProps}>{
    options.map((o, optionIndex) =>
      <option key={optionIndex} value={o.value}>{o.label}</option>
    )
  }</select>

export default Select