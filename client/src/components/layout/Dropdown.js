import React, { useState, useEffect, useRef } from 'react';
import PropTypes from 'prop-types';

// Icons
import ChervonIcon from '../icons/ChervonIcon';

/* 
  options = [
    {
      key: 'string',
      value: 'string',
    }
  ]

  const onChange = ({ name, value }) => 
    setFormData({ ...formData, [name]: value });

  size
  @type       number
  @desc       define the number of options that can be seen, extra options will be hidden and scrollable
*/
const Dropdown = ({
  label,
  required,
  name,
  options,
  value,
  onChangeHandler,
  informationText,
  error,
  optionHeight = 48,
  size = 10,
}) => {
  const [showDropdown, setShowDropdown] = useState(false);
  const dropdownRef = useRef(null);

  useEffect(() => {
    const dropdownClickHandler = e =>
      !dropdownRef.current?.contains(e.target) && setShowDropdown(false);

    // Handling click outside of component
    document.addEventListener('click', dropdownClickHandler, false);

    return () =>
      document.removeEventListener('click', dropdownClickHandler, false);
    // eslint-disable-next-line
  }, []);

  /* Showing limited options if size is defined */
  const dropdownOptionsStyle = {
    maxHeight: typeof size === 'number' ? optionHeight * size : 'auto',
  };
  const dropdownOptionStyle = {
    height: optionHeight,
  };

  return (
    <div className='dropdown-group'>
      <label htmlFor={name}>
        <span>{label}</span>
        {required && <span className='required-input' />}
      </label>

      <div className='dropdown-wrapper'>
        <div
          className={`dropdown ${error ? 'invalid' : ''}`}
          onClick={() => setShowDropdown(!showDropdown)}
          ref={dropdownRef}
        >
          <div className='dropdown-selected-option'>
            <span>{options.find(option => option.value === value)?.key}</span>
          </div>
          <div className='dropdown-arrow-wrapper'>
            <div
              className={`dropdown-arrow ${
                showDropdown ? 'options-shown' : ''
              }`}
            >
              <ChervonIcon />
            </div>
          </div>
        </div>
        {showDropdown && (
          <div className='dropdown-options' style={dropdownOptionsStyle}>
            {options.map(({ key, value }) => (
              <div
                className='dropdown-option'
                key={`dropdown-option-${key}-${value}`}
                onClick={e => onChangeHandler({ name, value })}
                style={dropdownOptionStyle}
              >
                <span>{key}</span>
              </div>
            ))}
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

Dropdown.propTypes = {
  label: PropTypes.string,
  required: PropTypes.bool,
  name: PropTypes.string,
  options: PropTypes.array,
  value: PropTypes.string,
  onChangeHandler: PropTypes.func,
  informationText: PropTypes.string,
  error: PropTypes.string,
  optionHeight: PropTypes.number,
  size: PropTypes.number,
};

export default Dropdown;
