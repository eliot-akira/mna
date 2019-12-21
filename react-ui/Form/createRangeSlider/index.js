// https://github.com/tajo/react-range
import { Range, getTrackBackground } from './Range'

const presets = {
  dark: {
    track: {
      height: '14px',
      width: '100%',
      borderRadius: '4px',
      backgroundColor: '#313644'
    },
    trackHighlight: {
      colors: ['#444b5d', '#313644']
    },
    thumb: {
      height: '14px',
      width: '14px',
      borderRadius: '50%',
      backgroundColor: '#8a95b5'
    }
  }
}

export default function createRangeSlider({ className = '', styles = {}, preset = 'dark' }) {

  const rangeStyles = {
    ...(preset && presets[preset] ? presets[preset] : {}),
    ...styles
  }

  const RangeSlider = ({ value, min, max, onChange, highlighToValue = true }) => {
    if (value < min) value = min
    if (value > max) value = max
    return (
      <div style={{ position: 'relative', margin: '1rem 0' }}>
        <Range
          min={min} max={max}
          values={[value]}
          onChange={values => onChange(values[0])}
          renderTrack={({ props, children }) => (
            <div
              {...props}
              style={{
                ...props.style,
                ...rangeStyles.track,
                ...(!highlighToValue ? {} : {
                  background: getTrackBackground({
                    values: [value],
                    min,
                    max,
                    ...rangeStyles.trackHighlight,
                  })
                })
              }}
            >
              {children}
            </div>
          )}
          renderThumb={({ props }) => (
            <div
              {...props}
              style={{
                ...props.style,
                ...rangeStyles.thumb
              }}
            />
          )}
        />
      </div>
    )
  }

  return { RangeSlider }

}
