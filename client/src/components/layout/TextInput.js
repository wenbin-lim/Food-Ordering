import React, { useState } from 'react';
import PropTypes from 'prop-types';

import sanitizeWhiteSpace from '../../utils/sanitizeWhiteSpace';

// Icons
import EyeIcon from '../icons/EyeIcon';
import EyeOffIcon from '../icons/EyeOffIcon';

/* 
  const onChange = ({ name, value }) => 
    setFormData({ ...formData, [name]: value });
*/

// Please do input validation in Parent Form
const TextInput = ({
  label,
  required = false,
  name,
  type,
  value,
  onChangeHandler,
  informationText,
  placeholder,
  error,
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
    if (type === 'number') {
      if ((e.which !== 45 && e.which !== 46 && e.which < 48) || e.which > 57) {
        e.preventDefault();
      }
    } else if (type === 'numeric') {
      if (e.which < 48 || e.which > 57) {
        e.preventDefault();
      }
    }
  };

  return (
    <div className='input-group'>
      <label htmlFor={name}>
        <span>{label}</span>
        {required && <span className='required-input' />}
      </label>

      <div
        className={sanitizeWhiteSpace(
          `input-field ${type === 'password' ? 'append-icon' : ''}`
        )}
      >
        <input
          name={name}
          type={inputType}
          value={value}
          pattern={inputType === 'numeric' ? '[0-9]*' : null}
          step={inputType === 'number' ? 'any' : null}
          onChange={onChange}
          onKeyPress={onKeyPress}
          className={error ? 'invalid' : ''}
          placeholder={placeholder ? placeholder : null}
        />

        {type === 'password' && (
          <div className='input-field-icon' onClick={toggleShowPassword}>
            {inputType === 'password' ? <EyeIcon /> : <EyeOffIcon />}
          </div>
        )}
      </div>

      {(informationText || error) && (
        <span className={`input-${error ? 'error-' : ''}message`}>
          {error ? error : informationText}
        </span>
      )}
    </div>
  );
};

TextInput.propTypes = {
  label: PropTypes.string,
  required: PropTypes.bool,
  name: PropTypes.string.isRequired,
  type: PropTypes.oneOf(['text', 'password', 'number', 'numeric']),
  value: PropTypes.string.isRequired,
  onChangeHandler: PropTypes.func.isRequired,
  informationText: PropTypes.string,
  placeholder: PropTypes.string,
  error: PropTypes.string,
};

export default TextInput;
