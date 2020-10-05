import React, { useState } from 'react';
import PropTypes from 'prop-types';

// Icons
import EyeIcon from '../icons/EyeIcon';
import EyeOffIcon from '../icons/EyeOffIcon';

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

  4. type
  @type       string of ['text', 'password']
  @desc       type of this input
  @required   true

  5. value
  @type       string
  @desc       value of this input
  @required   true

  6. onChangeHandler 
  @type       function
  @desc       onChange handler from Parent
  @example

  const onChange = ({ name, value }) => {
    setFormData({ ...formData, [name]: value });
  };
  
  @required   true

  7. informationText
  @type       string
  @desc       information text that is displayed below input field
  @required   false

  8. placeholder 
  @type       string
  @desc       placeholder of input field
  @required   false

  9. validity 
  @type       boolean
  @desc       shows if input field is valid or invalid
  @desc       should be passed down from Parent error checking
  @required   true
  @default    true

  10. errorMessage 
  @type       string
  @desc       displays error message below input field
  @required   true if validity is false
*/

// Please do input validation in Parent Form
const TextInput = ({
  label,
  showRequiredInLabel,
  name,
  type,
  value,
  onChangeHandler,
  informationText,
  placeholder,
  validity,
  errorMessage,
}) => {
  const [inputType, setInputType] = useState(type);

  const toggleShowPassword = () => {
    if (inputType === 'password') {
      setInputType('text');
    } else if (inputType === 'text') {
      setInputType('password');
    }
  };

  const onChange = e => {
    onChangeHandler({ name: e.target.name, value: e.target.value });
  };

  const onKeyPress = e => {
    if (type === 'number' || type === 'numeric') {
      if (e.which < 48 || e.which > 57) {
        e.preventDefault();
      }
    }
  };

  const numericInput = (
    <input
      name={name}
      type='numeric'
      value={value}
      pattern='[0-9]*'
      onChange={e => onChange(e)}
      onKeyPress={e => onKeyPress(e)}
      className={!validity ? 'invalid' : ''}
      placeholder={placeholder}
    />
  );

  return (
    <div className='input-group'>
      <label htmlFor={name}>
        <span>{label}</span>
        {showRequiredInLabel && (
          <small className='required-input'>* required</small>
        )}
      </label>
      <div
        className={`input-field ${type === 'password' ? 'append-icon' : ''}`}
      >
        {type === 'numeric' ? (
          numericInput
        ) : (
          <input
            name={name}
            type={inputType}
            value={value}
            onChange={e => onChange(e)}
            onKeyPress={e => onKeyPress(e)}
            className={!validity ? 'invalid' : ''}
            placeholder={placeholder}
          />
        )}

        {type === 'password' && (
          <div className='input-field-icon' onClick={toggleShowPassword}>
            {inputType === 'password' ? <EyeIcon /> : <EyeOffIcon />}
          </div>
        )}
      </div>
      {validity ? (
        <p className='input-message'>{informationText}</p>
      ) : (
        <p className='input-message error-message'>{errorMessage}</p>
      )}
    </div>
  );
};

TextInput.propTypes = {
  label: PropTypes.string,
  showRequiredInLabel: PropTypes.bool,
  name: PropTypes.string.isRequired,
  type: PropTypes.oneOf(['text', 'password', 'number', 'numeric']),
  value: PropTypes.string.isRequired,
  onChangeHandler: PropTypes.func.isRequired,
  informationText: PropTypes.string,
  placeholder: PropTypes.string,
  validity: PropTypes.bool.isRequired,
  errorMessage: (props, propName) => {
    if (!props['validity'] && typeof props[propName] !== 'string') {
      return new Error(
        'errorMessage cannot be empty if validity is false. errorMessage must be a string type.'
      );
    }
  },
};

export default TextInput;
