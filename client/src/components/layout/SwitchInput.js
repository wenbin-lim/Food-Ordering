import React from 'react';
import PropTypes from 'prop-types';

/* 
  =====
  Props
  =====
  1. label 
  @type       string
  @desc       label of input group
  @required   false
  
  2. name
  @type       string
  @desc       name of this input
  @required   true

  3. value
  @type       boolean
  @desc       value of this input
  @required   true

  4. onChangeHandler
  @type       function
  @desc       to update the form data
  @example

  const onChange = ({ name, value }) => {
    setFormData({ ...formData, [name]: value });
  };

  @required   true

  5. informationText
  @type       string
  @desc       information text that is displayed below input field
  @required   false

  6. validity 
  @type       boolean
  @desc       shows if field is valid or invalid
  @desc       should be passed down from Parent error checking
  @required   true
  @default    true

  7. errorMessage 
  @type       string
  @desc       displays error message below input field
  @required   true if validity is false
*/
const SwitchInput = ({
  label,
  name,
  value,
  onChangeHandler,
  informationText,
  validity,
  errorMessage,
}) => {
  const onClick = e => {
    onChangeHandler({ name, value: !value });
  };

  return (
    <div className='switch-group'>
      <label>{label}</label>
      <div className='switch-wrapper' onClick={e => onClick(e)}>
        <div className={`switch ${value ? 'checked' : ''}`}>
          <div className='switch-toggle'></div>
        </div>
      </div>
      {validity ? (
        <p className='switch-input-message'>{informationText}</p>
      ) : (
        <p className='switch-input-message error-message'>{errorMessage}</p>
      )}
    </div>
  );
};

SwitchInput.propTypes = {
  label: PropTypes.string,
  name: PropTypes.string.isRequired,
  value: PropTypes.bool.isRequired,
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

export default SwitchInput;
