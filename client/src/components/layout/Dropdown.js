import React, { useState, useEffect, useRef } from 'react';
import PropTypes from 'prop-types';

import { v4 as uuid } from 'uuid';

// Icons
import ChervonIcon from '../icons/ChervonIcon';

// Animations
import { TimelineMax } from 'gsap';

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
  @desc       name of this dropdown
  @required   true

  3. showRequiredInLabel 
  @type       boolean
  @desc       show a required label in input group
  @required   false

  4. options
  @type       array of options {value, name}
  @desc       to populate the options
  @required   true
  @example

  const [options, setOptions] = useState([
    {
      key:  'some name',
      value: 'some value',
    },
  ]);

  5. value
  @type       string
  @desc       value of this dropdown
  @required   true

  6. onChangeHandler
  @type       function
  @desc       to update the form data
  @example

  const onChange = ({ name, value }) => {
    setFormData({ ...formData, [name]: value });
  };

  @required   true

  7. informationText
  @type       string
  @desc       information text that is displayed below input field
  @required   false

  8. validity 
  @type       boolean
  @desc       shows if field is valid or invalid
  @desc       should be passed down from Parent error checking
  @required   true
  @default    true

  9. errorMessage 
  @type       string
  @desc       displays error message below input field
  @required   true if validity is false

  10. size
  @type       number
  @desc       define the number of options that can be seen, extra options will be hidden and scrollable
  @required   false
*/
const Dropdown = ({
  label,
  name,
  showRequiredInLabel,
  options,
  value,
  onChangeHandler,
  informationText,
  validity,
  errorMessage,
  size,
}) => {
  const [showDropdown, setShowDropdown] = useState(false);
  const dropdownRef = useRef(null);
  const dropdownArrowRef = useRef(null);

  /* 
    ==========
    Animations 
    ==========
    Dropdown Arrow will rotate 180 deg when toggled
    Dropdown Options will fade in/out when toggled
  */

  const [tlm] = useState(
    new TimelineMax({
      paused: true,
      reversed: true,
    })
  );
  const animationTime = 0.3;

  const toggleDropdown = () => {
    setShowDropdown(!showDropdown);
    tlm.reversed() ? tlm.play() : tlm.reverse();
  };

  const closeDropdown = () => {
    setShowDropdown(false);
    tlm.reverse();
  };

  useEffect(() => {
    /* Functions to run on mount */
    tlm.to(
      dropdownArrowRef.current,
      animationTime,
      {
        rotation: 180,
      },
      'animation'
    );

    const dropdownClickHandler = e => {
      if (dropdownRef.current && dropdownRef.current.contains(e.target)) {
        return;
      } else {
        closeDropdown();
      }
    };

    // Handling click outside of component
    document.addEventListener('click', dropdownClickHandler, false);
    return () => {
      /* Functions to run before unmount */
      document.removeEventListener('click', dropdownClickHandler, false);
    };
    // eslint-disable-next-line
  }, []);

  /* Showing limited options if size is defined */
  // height is 48px following icon size
  const dropdownOptionHeight = 48;
  const dropdownOptionsStyle = {
    height:
      typeof size === 'number' ? dropdownOptionHeight * size + 'px' : 'auto',
    overflowY: typeof size === 'number' ? 'scroll' : 'auto',
  };
  const dropdownOptionStyle = {
    height: dropdownOptionHeight + 'px',
  };

  return (
    <div className='dropdown-group'>
      <label htmlFor={name}>
        <span>{label}</span>
        {showRequiredInLabel && (
          <small className='required-input'>* required</small>
        )}
      </label>
      <div className='dropdown-wrapper'>
        <div
          className={`dropdown ${!validity ? 'invalid' : ''}`}
          onClick={toggleDropdown}
          ref={dropdownRef}
        >
          <div className='dropdown-selected-option'>
            <span>{options.find(option => option.value === value).key}</span>
          </div>
          <div className='dropdown-arrow-wrapper'>
            <div className='dropdown-arrow' ref={dropdownArrowRef}>
              <ChervonIcon />
            </div>
          </div>
        </div>
        {showDropdown && (
          <div className='dropdown-options' style={dropdownOptionsStyle}>
            {options.map(option => (
              <div
                className='dropdown-option'
                key={uuid()}
                onClick={e => onChangeHandler({ name, value: option.value })}
                style={dropdownOptionStyle}
              >
                <span>{option.key}</span>
              </div>
            ))}
          </div>
        )}
      </div>
      {validity ? (
        <p className='dropdown-message'>{informationText}</p>
      ) : (
        <p className='dropdown-message error-message'>{errorMessage}</p>
      )}
    </div>
  );
};

Dropdown.propTypes = {
  label: PropTypes.string,
  name: PropTypes.string.isRequired,
  showRequiredInLabel: PropTypes.bool,
  options: PropTypes.arrayOf(
    PropTypes.shape({
      key: PropTypes.string.isRequired,
      value: PropTypes.string.isRequired,
    })
  ).isRequired,
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
  size: PropTypes.number,
};

export default Dropdown;
