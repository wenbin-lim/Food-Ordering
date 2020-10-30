import React, { useState } from 'react';
import PropTypes from 'prop-types';

import { v4 as uuid } from 'uuid';

// Icons
import CheckIcon from '../icons/CheckIcon';

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

const CheckboxInput = ({
  label,
  required,
  name,
  inputs,
  value,
  onChangeHandler,
  informationText,
  error,
  inline = false,
  max,
}) => {
  const [maxSelection] = useState(
    typeof max === 'number' ? max : inputs.length
  );

  const onClick = (e, newValue) => {
    const currentSelectedLength = value.length;

    if (value.indexOf(newValue) < 0) {
      currentSelectedLength < maxSelection &&
        onChangeHandler({ name, value: [...value, newValue] });
    } else {
      onChangeHandler({ name, value: value.filter(el => el !== newValue) });
    }
  };

  return (
    <div className='checkbox-group'>
      <label htmlFor={name}>
        <span>{label}</span>
        {required && <span className='required-input'>* required</span>}
      </label>

      {inputs &&
        inputs.map(input => (
          <div
            className={`checkbox-input ${
              inline ? 'checkbox-input-inline' : ''
            }`.trim()}
            key={uuid()}
            onClick={e => onClick(e, input.value)}
          >
            <div className='checkbox-wrapper'>
              <div
                className={`checkbox ${
                  value.indexOf(input.value) >= 0 && 'checked'
                }`}
              >
                <CheckIcon />
              </div>
            </div>
            <div className='checkbox-input-key'>{input.key}</div>
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

CheckboxInput.propTypes = {
  label: PropTypes.string,
  name: PropTypes.string.isRequired,
  required: PropTypes.bool,
  inputs: PropTypes.array.isRequired,
  value: PropTypes.array.isRequired,
  onChangeHandler: PropTypes.func.isRequired,
  informationText: PropTypes.string,
  error: PropTypes.string,
  inline: PropTypes.bool,
  max: PropTypes.number,
};

export default CheckboxInput;
