import React from 'react';
import PropTypes from 'prop-types';

import { v4 as uuid } from 'uuid';
/* 
  =====
  Props
  =====
  1. label 
  @type       string
  @desc       label of input group
  @required   false
  
  2. showRequiredInLabel 
  @type       boolean
  @desc       show a required label in input group
  @required   false

  3. name
  @type       string
  @desc       name of this input
  @required   true

  4. radioInputs
  @type       array of radioInput {key, value}
  @desc       to populate the radio inputs
  @required   true
  @example

  const [radioInputs] = useState([
    {
      key: 'some key',
      value: 'some value',
    },
  ]);

  5. value
  @type       string
  @desc       value of this input
  @required   true

  6. onChangeHandler
  @type       function
  @desc       to update the form data
  @example

  const onChange = ({ name, value }) => {
    setFormData({ ...formData, [name]: value });
  };

  @required   true

  7. informationText
  @type       string
  @desc       information text that is displayed below input field
  @required   false

  8. validity 
  @type       boolean
  @desc       shows if field is valid or invalid
  @desc       should be passed down from Parent error checking
  @required   true
  @default    true

  9. errorMessage 
  @type       string
  @desc       displays error message below input field
  @required   true if validity is false

  10. inline
  @type       boolean
  @desc       changes radio input to inline structure
  @required   false
  @default    false
*/
const RadioInput = ({
  label,
  showRequiredInLabel,
  name,
  radioInputs,
  value,
  onChangeHandler,
  informationText,
  validity,
  errorMessage,
  inline = false,
}) => {
  const onChange = e => {
    onChangeHandler({ name: e.target.name, value: e.target.value });
  };

  const radioInputInlineStyle = {
    display: inline ? 'inline-flex' : 'flex',
    marginRight: inline ? '1rem' : '',
  };

  return (
    <div className='radio-group'>
      <label>
        <span>{label}</span>
        {showRequiredInLabel && (
          <small className='required-input'>* required</small>
        )}
      </label>
      {radioInputs.map(radioInput => (
        <div className='radio-input' key={uuid()} style={radioInputInlineStyle}>
          <input
            type='radio'
            name={name}
            id={`${name}-radio-input-${radioInput.value}`}
            value={radioInput.value}
            checked={radioInput.value === value}
            onChange={e => onChange(e)}
          />
          <label
            htmlFor={`${name}-radio-input-${radioInput.value}`}
            className='radio-input-key'
          >
            {radioInput.key}
          </label>
        </div>
      ))}
      {validity ? (
        <p className='radio-input-message'>{informationText}</p>
      ) : (
        <p className='radio-input-message error-message'>{errorMessage}</p>
      )}
    </div>
  );
};

RadioInput.propTypes = {
  label: PropTypes.string,
  name: PropTypes.string.isRequired,
  showRequiredInLabel: PropTypes.bool,
  radioInputs: PropTypes.arrayOf(
    PropTypes.shape({
      key: PropTypes.string.isRequired,
      value: PropTypes.string.isRequired,
    })
  ).isRequired,
  value: PropTypes.string.isRequired,
  onChangeHandler: PropTypes.func.isRequired,
  informationText: PropTypes.string,
  validity: PropTypes.bool.isRequired,
  errorMessage: (props, propName) => {
    if (!props['validity'] && typeof props[propName] !== 'string') {
      return new Error(
        'errorMessage cannot be empty if validity is false. errorMessage must be a string type.'
      );
    }
  },
  inline: PropTypes.bool,
};

export default RadioInput;
