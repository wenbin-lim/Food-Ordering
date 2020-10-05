import React, { useState, useEffect } from 'react';
import PropTypes from 'prop-types';

import Moment from 'react-moment';
import moment from 'moment';

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

  @name       min
  @type       Date obj
  @desc       min date of this input
  @required   true

  @name       max
  @type       Date obj
  @desc       max date of this input
  @desc       cannot be less than min date
  @required   true

  @name       value
  @type       Date obj
  @desc       value of this input
  @required   true

  @name       format
  @type       string
  @desc       Moment format for this input
  @required   true

  @name       disableDays
  @type       array of numbers
  @desc       days in number (0 to 6) to disable 
  @desc       0 = sun, 1 = mon, 2 = tue, 3 = wed, 4 = thu, 5 = fri, 6 = sat
  @required   false

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

const convertMonthToString = month => {
  switch (month) {
    case 0:
      return 'Jan';
    case 1:
      return 'Feb';
    case 2:
      return 'Mar';
    case 3:
      return 'Apr';
    case 4:
      return 'May';
    case 5:
      return 'Jun';
    case 6:
      return 'Jul';
    case 7:
      return 'Aug';
    case 8:
      return 'Sep';
    case 9:
      return 'Oct';
    case 10:
      return 'Nov';
    case 11:
      return 'Dec';
    default:
      return '';
  }
};

const DatePicker = ({
  label,
  showRequiredInLabel,
  name,
  min,
  max,
  value,
  format,
  disableDays,
  onChangeHandler,
  informationText,
  validity,
  errorMessage,
}) => {
  const onChange = () => {
    onChangeHandler({ name, value: selectedDate });
  };

  const [showDatePicker, setShowDatePicker] = useState(false);
  const [showMonthsPicker, setShowMonthsPicker] = useState(false);
  const [showYearPicker, setShowYearPicker] = useState(false);

  const [selectedDate, setSelectedDate] = useState(value);

  const [availableMonths, setAvailableMonths] = useState([]);
  const [availableYears, setAvailableYears] = useState([]);
  const [numOfWeeksInSelectedMonth, setNumOfWeeksInSelectedMonth] = useState(0);
  const [availableDays, setAvailableDays] = useState([]);

  useEffect(() => {
    var minDate = moment(min);
    var maxDate = moment(max);

    // finding available months
    var endMonth = maxDate.subtract(1, 'month');
    var month = moment(minDate);

    var months = [];
    while (month.isBefore(endMonth)) {
      month.add(1, 'month');
      months.push(month.month());
    }

    months = months.sort((a, b) => {
      return a - b;
    });
    months = [...new Set(months)];

    setAvailableMonths(months);

    // finding available years
    var startYear = minDate.year();
    var endYear = maxDate.year();

    var years = [];
    while (startYear <= endYear) {
      years.push(startYear);
      startYear++;
    }

    setAvailableYears(years);

    // eslint-disable-next-line
  }, []);

  useEffect(() => {
    // finding available days in selected year and month
    var selectedMonth = moment();
    selectedMonth.set('year', selectedDate.getFullYear());
    selectedMonth.set('month', selectedDate.getMonth());

    var startOfMonth = moment(selectedMonth).startOf('month');
    var numOfDays = moment(selectedMonth).daysInMonth();

    var days = [];
    for (var i = 0; i < numOfDays; i++) {
      const day = moment(startOfMonth);
      day.add(i, 'day');

      days.push({
        date: i + 1,
        day: day.day(),
      });
    }

    setAvailableDays(days);

    // find number of weeks inside selected month
    var endOfMonth = moment(selectedMonth).endOf('month');
    var startOfMonthWeek = startOfMonth.week();
    var endOfMonthWeek = endOfMonth.week();

    setNumOfWeeksInSelectedMonth(endOfMonthWeek - startOfMonthWeek + 1);
  }, [selectedDate]);

  return (
    <div className='datepicker-group'>
      <label>
        <span>{label}</span>
        {showRequiredInLabel && (
          <small className='required-input'>* required</small>
        )}
      </label>
      <div
        className={`datepicker-input-field ${!validity ? 'invalid' : ''}`}
        onClick={() => setShowDatePicker(true)}
      >
        <Moment format={format}>{value}</Moment>
      </div>
      {showDatePicker && (
        <div className='datepicker-scrim'>
          <div className='datepicker'>
            <div className='datepicker-header'>
              <div
                className='datepicker-month'
                onClick={e => setShowMonthsPicker(!showMonthsPicker)}
              >
                {convertMonthToString(selectedDate.getMonth())}
                {showMonthsPicker && (
                  <div className='months'>
                    {availableMonths.map(month => (
                      <div
                        className='month'
                        key={uuid()}
                        onClick={() =>
                          setSelectedDate(
                            new Date(selectedDate.setMonth(month))
                          )
                        }
                      >
                        {convertMonthToString(month)}
                      </div>
                    ))}
                  </div>
                )}
              </div>
              <div
                className='datepicker-year'
                onClick={e => setShowYearPicker(!showYearPicker)}
              >
                {selectedDate.getFullYear()}
                {showYearPicker && (
                  <div className='years'>
                    {availableYears.map(year => (
                      <div
                        className='year'
                        key={uuid()}
                        onClick={() =>
                          setSelectedDate(
                            new Date(selectedDate.setFullYear(year))
                          )
                        }
                      >
                        {year}
                      </div>
                    ))}
                  </div>
                )}
              </div>
            </div>
            <div
              className='datepicker-calendar'
              style={{
                display: 'grid',
                gridTemplateColumns: 'repeat(7, 1fr)',
                gridTemplateAreas: `auto repeat(${numOfWeeksInSelectedMonth}, auto)`,
                gridGap: '5px',
              }}
            >
              {['Su', 'Mo', 'Tu', 'We', 'Th', 'Fr', 'Sa'].map(day => (
                <div className='days-header' key={uuid()}>
                  {day}
                </div>
              ))}
              {availableDays.length > 0 &&
                [...Array(availableDays[0].day)].map(() => (
                  <div key={uuid()}></div>
                ))}
              {availableDays.map(day => (
                <div
                  className={`days ${
                    day.date === selectedDate.getDate() ? 'selected' : ''
                  } ${
                    disableDays && disableDays.indexOf(day.day) >= 0
                      ? 'disabled'
                      : ''
                  }`}
                  key={uuid()}
                  onClick={() => {
                    if (!disableDays || disableDays.indexOf(day.day) < 0) {
                      setSelectedDate(new Date(selectedDate.setDate(day.date)));
                      setShowDatePicker(false);
                      onChange();
                    }
                  }}
                >
                  {day.date}
                </div>
              ))}
            </div>
          </div>
        </div>
      )}
      {validity ? (
        <p className='datepicker-input-message'>{informationText}</p>
      ) : (
        <p className='datepicker-input-message error-message'>{errorMessage}</p>
      )}
    </div>
  );
};

DatePicker.propTypes = {
  label: PropTypes.string,
  name: PropTypes.string.isRequired,
  showRequiredInLabel: PropTypes.bool,
  min: PropTypes.instanceOf(Date).isRequired,
  max: PropTypes.instanceOf(Date).isRequired,
  value: PropTypes.instanceOf(Date).isRequired,
  format: PropTypes.string.isRequired,
  disableDays: PropTypes.arrayOf(PropTypes.number),
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

export default DatePicker;
