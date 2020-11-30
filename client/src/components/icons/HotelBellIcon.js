import React from 'react';
import PropTypes from 'prop-types';

const HotelBellIcon = ({ width = 24, height = 24 }) => {
  return (
    <svg
      xmlns='http://www.w3.org/2000/svg'
      width={width}
      height={height}
      viewBox='0 0 24 24'
      fill='none'
      stroke='currentColor'
      strokeWidth='2'
      strokeLinecap='round'
      strokeLinejoin='round'
      className='icon hotel-bell-icon'
    >
      <circle cx='12' cy='7.5' r='1.25' fill='currentColor' />
      <line x1='7' y1='5.75' x2='17' y2='5.75' />
      <path d='M20 15H4C4 15 4 12 5.77778 10.7143C7.55556 9.42857 9.33333 9 12 9C14.6667 9 16.4444 9.42857 18.2222 10.7143C20 12 20 15 20 15Z' />
      <line x1='2' y1='18' x2='22' y2='18' />
    </svg>
  );
};

HotelBellIcon.propTypes = {
  width: PropTypes.number,
  height: PropTypes.number,
};

export default HotelBellIcon;
