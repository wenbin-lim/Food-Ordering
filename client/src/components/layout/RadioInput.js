import React from 'react';
import PropTypes from 'prop-types';

import { v4 as uuid } from 'uuid';

/*
  inputs = [
    {
      key: 'string',
      value: 'string',
    }
  ]

  const onChange = ({ name, value }) => 
    setFormData({ ...formData, [name]: value });
*/

const RadioInput = ({
  label,
  required,
  name,
  inputs,
  value,
  onChangeHandler,
  informationText,
  error,
  inline = false,
}) => {
  const onChange = e =>
    onChangeHandler({ name: e.target.name, value: e.target.value });

  return (
    <div className='radio-group'>
      <label htmlFor={name}>
        <span>{label}</span>
        {required && <span className='required-input'>* required</span>}
      </label>

      {inputs.map(input => (
        <div
          className={`radio-input ${inline ? 'radio-input-inline' : ''}`.trim()}
          key={uuid()}
        >
          <input
            type='radio'
            name={name}
            id={`${name}-radio-input-${input.value}`}
            value={input.value}
            checked={input.value === value}
            onChange={onChange}
          />
          <label
            htmlFor={`${name}-radio-input-${input.value}`}
            className='radio-input-key'
          >
            {input.key}
          </label>
        </div>
      ))}

      {(informationText || error) && (
        <p className={`input-${error ? 'error-' : ''}message`}>
          {error ? error : informationText}
        </p>
      )}
    </div>
  );
};

RadioInput.propTypes = {
  label: PropTypes.string,
  name: PropTypes.string.isRequired,
  required: PropTypes.bool,
  inputs: PropTypes.arrayOf(
    PropTypes.shape({
      key: PropTypes.string.isRequired,
      value: PropTypes.string.isRequired,
    })
  ).isRequired,
  value: PropTypes.string.isRequired,
  onChangeHandler: PropTypes.func.isRequired,
  informationText: PropTypes.string,
  error: PropTypes.string,
  inline: PropTypes.bool,
};

export default RadioInput;
