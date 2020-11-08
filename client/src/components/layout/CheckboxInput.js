import React, { useState } from 'react';
import PropTypes from 'prop-types';

import { v4 as uuid } from 'uuid';

import sanitizeWhiteSpace from '../../utils/sanitizeWhiteSpace';

// Icons
import CheckIcon from '../icons/CheckIcon';

/*
  inputs = [
    {
      key: 'string' or jsx,
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
  ordered = false,
}) => {
  const [maxSelection] = useState(
    typeof max === 'number' && max > 0 ? max : inputs.length
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
        {required && <span className='required-input' />}
      </label>

      {(informationText || error) && (
        <span className={`input-${error ? 'error-' : ''}message`}>
          {error ? error : informationText}
        </span>
      )}

      <div className='checkbox-inputs'>
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
                  className={sanitizeWhiteSpace(
                    `checkbox
                  ${ordered ? 'checkbox-ordered' : ''}
                  ${value.indexOf(input.value) >= 0 ? 'checked' : ''}
                  `
                  )}
                >
                  {ordered ? (
                    <span className='checkbox-value-index'>
                      {value.indexOf(input.value) + 1}
                    </span>
                  ) : (
                    <CheckIcon />
                  )}
                </div>
              </div>
              <div className='checkbox-input-key'>{input.key}</div>
            </div>
          ))}
      </div>
    </div>
  );
};

CheckboxInput.propTypes = {
  label: PropTypes.string,
  name: PropTypes.string,
  required: PropTypes.bool,
  inputs: PropTypes.arrayOf(
    PropTypes.shape({
      key: PropTypes.oneOfType([PropTypes.element, PropTypes.string]),
      value: PropTypes.string,
    })
  ),
  value: PropTypes.array,
  onChangeHandler: PropTypes.func,
  informationText: PropTypes.string,
  error: PropTypes.string,
  inline: PropTypes.bool,
  max: PropTypes.number,
  ordered: PropTypes.bool,
};

export default CheckboxInput;
