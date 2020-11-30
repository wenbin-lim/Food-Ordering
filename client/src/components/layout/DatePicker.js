import React, { useState, useEffect } from 'react';
import PropTypes from 'prop-types';
import { createPortal } from 'react-dom';

import Moment from 'react-moment';
import moment from 'moment';

// Misc
import { v4 as uuid } from 'uuid';

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

/* 
  disableDays
  @type       array of numbers
  @desc       days in number (0 to 6) to disable 
  @desc       0 = sun, 1 = mon, 2 = tue, 3 = wed, 4 = thu, 5 = fri, 6 = sat
  @required   false
*/
const DatePicker = ({
  label,
  required,
  name,
  min = new Date(1940, 0, 1),
  max = new Date(),
  value = new Date(),
  format = 'DD-MM-YYYY',
  disableDays,
  onChangeHandler,
  informationText,
  error,
}) => {
  const onChange = () => {
    onChangeHandler({ name, value: selectedDate });
  };

  const [datepickerScrim] = useState(document.createElement('div'));
  datepickerScrim.id = 'datepicker-root';
  datepickerScrim.classList.add('datepicker-scrim');

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
    if (showDatePicker) {
      document.body.style.overflow = 'hidden';
      document.body.appendChild(datepickerScrim);
    } else {
      if (document.body.contains(datepickerScrim)) {
        document.body.removeChild(datepickerScrim);
        document.body.style.overflow = 'auto';
      }
    }
  }, [showDatePicker]);

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
      <label htmlFor={name}>
        <span>{label}</span>
        {required && <span className='required-input' />}
      </label>

      <div
        className={`datepicker-input-field ${error ? 'invalid' : ''}`}
        onClick={() => setShowDatePicker(true)}
      >
        <Moment format={format}>{value}</Moment>
      </div>

      {showDatePicker &&
        createPortal(
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
          </div>,
          datepickerScrim
        )}

      {(informationText || error) && (
        <span className={`input-${error ? 'error-' : ''}message`}>
          {error ? error : informationText}
        </span>
      )}
    </div>
  );
};

DatePicker.propTypes = {};

export default DatePicker;
