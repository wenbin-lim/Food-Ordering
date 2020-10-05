import React, { useState } from 'react';
import PropTypes from 'prop-types';

// Icons
import CheckIcon from '../icons/CheckIcon';

// Misc
import { v4 as uuid } from 'uuid';
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

  @name       value
  @type       object of {hour, min, sec}
  @desc       value of this input
  @required   true

  @name       onChangeHandler 
  @type       function
  @desc       onChange handler from Parent
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
  @desc       shows if input field is valid or invalid
  @desc       should be passed down from Parent error checking
  @required   true
  @default    true

  @name       errorMessage 
  @type       string
  @desc       displays error message below input field
  @required   true if validity is false
*/

// Please do input validation in Parent Form
const TimePicker = ({
  label,
  showRequiredInLabel,
  name,
  value,
  onChangeHandler,
  informationText,
  validity,
  errorMessage,
}) => {
  const [selectedTime, setSelectedTime] = useState(value);
  const [showTimePicker, setShowTimePicker] = useState(false);

  const [showHours, setShowHours] = useState(false);
  const [showMins, setShowMins] = useState(false);
  const [showSecs, setShowSecs] = useState(false);

  const onChange = () => {
    onChangeHandler({ name, value: selectedTime });
  };

  return (
    <div className='timepicker-group'>
      <label htmlFor={name}>
        <span>{label}</span>
        {showRequiredInLabel && (
          <small className='required-input'>* required</small>
        )}
      </label>
      <div
        className={`timepicker-input-field ${!validity ? 'invalid' : ''}`}
        onClick={() => setShowTimePicker(true)}
      >
        {`${('0' + value.hour).slice(-2)}:${('0' + value.min).slice(-2)}:${(
          '0' + value.sec
        ).slice(-2)}`}
      </div>
      {showTimePicker && (
        <div
          className='timepicker-scrim'
          onClick={() => setShowTimePicker(false)}
        >
          <div className='timepicker' onClick={e => e.stopPropagation()}>
            <div className='timepicker-header'>
              <div className='timepicker-header-item'>Hour</div>
              <div className='timepicker-header-item'>Min</div>
              <div className='timepicker-header-item'>Sec</div>
            </div>
            <div className='timepicker-content'>
              <div
                className='timepicker-content-item timepicker-content-item-hour'
                onClick={() => setShowHours(!showHours)}
              >
                {('0' + selectedTime.hour).slice(-2)}
                {showHours && (
                  <div className='hours'>
                    {[...Array(24)].map((el, index) => (
                      <div
                        className='hour'
                        key={uuid()}
                        onClick={() =>
                          setSelectedTime({ ...selectedTime, hour: index })
                        }
                      >
                        {('0' + index).slice(-2)}
                      </div>
                    ))}
                  </div>
                )}
              </div>
              <div
                className='timepicker-content-item timepicker-content-item-min'
                onClick={() => setShowMins(!showMins)}
              >
                {('0' + selectedTime.min).slice(-2)}
                {showMins && (
                  <div className='mins'>
                    {[...Array(60)].map((el, index) => (
                      <div
                        className='min'
                        key={uuid()}
                        onClick={() =>
                          setSelectedTime({ ...selectedTime, min: index })
                        }
                      >
                        {('0' + index).slice(-2)}
                      </div>
                    ))}
                  </div>
                )}
              </div>
              <div
                className='timepicker-content-item timepicker-content-item-sec'
                onClick={() => setShowSecs(!showSecs)}
              >
                {('0' + selectedTime.sec).slice(-2)}
                {showSecs && (
                  <div className='secs'>
                    {[...Array(60)].map((el, index) => (
                      <div
                        className='sec'
                        key={uuid()}
                        onClick={() =>
                          setSelectedTime({ ...selectedTime, sec: index })
                        }
                      >
                        {('0' + index).slice(-2)}
                      </div>
                    ))}
                  </div>
                )}
              </div>
            </div>
            <div className='timepicker-footer'>
              <button
                className='btn btn-block btn-block-bottom btn-primary'
                onClick={() => {
                  onChange();
                  setShowTimePicker(false);
                }}
              >
                <div className='content'>
                  Ok
                  <CheckIcon direction='right' />
                </div>
              </button>
            </div>
          </div>
        </div>
      )}
      {validity ? (
        <p className='timepicker-message'>{informationText}</p>
      ) : (
        <p className='timepicker-message error-message'>{errorMessage}</p>
      )}
    </div>
  );
};

TimePicker.propTypes = {
  label: PropTypes.string,
  showRequiredInLabel: PropTypes.bool,
  name: PropTypes.string.isRequired,
  value: PropTypes.shape({
    hour: PropTypes.oneOf([...new Array(24)].map((_, i) => i)),
    min: PropTypes.oneOf([...new Array(60)].map((_, i) => i)),
    sec: PropTypes.oneOf([...new Array(60)].map((_, i) => i)),
  }),
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

export default TimePicker;
