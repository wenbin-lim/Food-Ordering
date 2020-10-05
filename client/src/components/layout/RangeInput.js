import React from 'react';
import PropTypes from 'prop-types';

/* 
  =====
  Props
  =====
  @name       label 
  @type       string
  @desc       label of input group
  @required   false
  
  @name       showRequiredInLabel 
  @type       boolean
  @desc       show a required label in input group
  @required   false

  @name       name
  @type       string
  @desc       name of this input
  @required   true

  @name       min
  @type       number
  @desc       min of this input
  @required   true

  @name       max
  @type       number
  @desc       max of this input
  @required   true

  @name       step
  @type       number
  @desc       step of this input
  @required   true

  @name       value
  @type       string
  @desc       value of this input
  @required   true

  @name       onChangeHandler
  @type       function
  @desc       to update the form data
  @example

  const onChange = ({ name, value }) => {
    setFormData({ ...formData, [name]: value });
  };

  @required   true

  @name       informationText
  @type       string
  @desc       information text that is displayed below input field
  @required   false

  @name       validity 
  @type       boolean
  @desc       shows if field is valid or invalid
  @desc       should be passed down from Parent error checking
  @required   true
  @default    true

  @name       errorMessage 
  @type       string
  @desc       displays error message below input field
  @required   true if validity is false
*/
const RangeInput = ({
  label,
  showRequiredInLabel,
  name,
  min,
  max,
  step,
  value,
  onChangeHandler,
  informationText,
  validity,
  errorMessage,
}) => {
  const onChange = e => {
    onChangeHandler({ name: e.target.name, value: e.target.value });
  };

  return (
    <div className='range-group'>
      <label>
        <span>{label}</span>
        {showRequiredInLabel && (
          <small className='required-input'>* required</small>
        )}
      </label>
      <div className='range-input'>
        <input
          type='range'
          name={name}
          value={value}
          min={min}
          max={max}
          step={step}
          onChange={e => onChange(e)}
        />
        <div
          className='range-progress'
          style={{ width: `${((value - min) / (max - min)) * 100}%` }}
        />
        <div
          className='range-thumb'
          style={{ left: `${((value - min) / (max - min)) * 100}%` }}
        />
        <div
          className='range-progress-indicator'
          style={{ left: `${((value - min) / (max - min)) * 100}%` }}
        >
          {value}
        </div>
      </div>
      {validity ? (
        <p className='range-input-message'>{informationText}</p>
      ) : (
        <p className='range-input-message error-message'>{errorMessage}</p>
      )}
    </div>
  );
};

RangeInput.propTypes = {
  label: PropTypes.string,
  name: PropTypes.string.isRequired,
  showRequiredInLabel: PropTypes.bool,
  min: PropTypes.number.isRequired,
  max: PropTypes.number.isRequired,
  step: PropTypes.number,
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
};

export default RangeInput;
