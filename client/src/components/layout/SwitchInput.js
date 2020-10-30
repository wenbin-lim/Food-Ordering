import React from 'react';
import PropTypes from 'prop-types';

/* 
  const onChange = ({ name, value }) => 
    setFormData({ ...formData, [name]: value });
*/
const SwitchInput = ({
  label,
  name,
  value,
  onChangeHandler,
  informationText,
  error,
}) => {
  const onClick = e => {
    onChangeHandler({ name, value: !value });
  };

  return (
    <div className='switch-group'>
      <label>{label}</label>

      <div className='switch-wrapper' onClick={onClick}>
        <div className={`switch ${value ? 'checked' : ''}`}>
          <div className='switch-toggle' />
        </div>
      </div>

      {(informationText || error) && (
        <p className={`input-${error ? 'error-' : ''}message`}>
          {error ? error : informationText}
        </p>
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
  error: PropTypes.string,
};

export default SwitchInput;
