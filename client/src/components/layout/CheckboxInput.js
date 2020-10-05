import React from 'react';
import PropTypes from 'prop-types';

import { v4 as uuid } from 'uuid';

// Icons
import CheckIcon from '../icons/CheckIcon';

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

  4. value
  @type       array
  @desc       value of this input in array form
  @required   true

  4. checkboxInputs
  @type       array of checkboxInputs {label, value}
  @desc       to populate the checkbox inputs
  @required   true
  @example

  const [checkboxInputs] = useState([
    {
      key: 'some key',
      value: 'some value',
    },
  ]);

  5. onChangeHandler
  @type       function
  @desc       to update the form data
  @example

  const onChange = ({ name, value }) => {
    setFormData({ ...formData, [name]: value });
  };

  @required   true

  6. informationText
  @type       string
  @desc       information text that is displayed below input field
  @required   false

  7. validity 
  @type       boolean
  @desc       shows if field is valid or invalid
  @desc       should be passed down from Parent error checking
  @required   true
  @default    true

  8. errorMessage 
  @type       string
  @desc       displays error message below input field
  @required   true if validity is false

  9. inline
  @type       boolean
  @desc       changes checkbox input to inline structure
  @required   false
  @default    false
*/
const CheckboxInput = ({
  label,
  showRequiredInLabel,
  name,
  checkboxInputs,
  value,
  onChangeHandler,
  informationText,
  validity,
  errorMessage,
  inline = false,
}) => {
  const onClick = (e, newValue) => {
    // check if newValue is inside value
    // if inside remove, if not inside add in
    if (value.indexOf(newValue) < 0) {
      onChangeHandler({ name, value: [...value, newValue] });
    } else {
      onChangeHandler({ name, value: value.filter(el => el !== newValue) });
    }
  };

  const checkboxInputInlineStyle = {
    display: inline ? 'inline-flex' : 'flex',
    marginRight: inline ? '1rem' : '',
  };

  return (
    <div className='checkbox-group'>
      <label>
        <span>{label}</span>
        {showRequiredInLabel && (
          <small className='required-input'>* required</small>
        )}
      </label>
      {checkboxInputs.map(checkboxInput => (
        <div
          className='checkbox-input'
          key={uuid()}
          style={checkboxInputInlineStyle}
        >
          <div
            className='checkbox-wrapper'
            onClick={e => onClick(e, checkboxInput.value)}
          >
            <div
              className={`checkbox ${
                value.indexOf(checkboxInput.value) >= 0 && 'checked'
              }`}
            >
              <CheckIcon />
            </div>
          </div>
          <div
            className='checkbox-input-key'
            onClick={e => onClick(e, checkboxInput.value)}
          >
            {checkboxInput.key}
          </div>
        </div>
      ))}
      {validity ? (
        <p className='checkbox-input-message'>{informationText}</p>
      ) : (
        <p className='checkbox-input-message error-message'>{errorMessage}</p>
      )}
    </div>
  );
};

CheckboxInput.propTypes = {
  label: PropTypes.string,
  name: PropTypes.string.isRequired,
  showRequiredInLabel: PropTypes.bool,
  checkboxInputs: PropTypes.array.isRequired,
  value: PropTypes.array.isRequired,
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

export default CheckboxInput;
