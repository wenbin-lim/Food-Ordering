import React from 'react';
import PropTypes from 'prop-types';

const DollarIcon = ({ width = 24, height = 24 }) => {
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
      className='icon dollar-icon'
    >
      <line x1='12' y1='1' x2='12' y2='23'></line>
      <path d='M17 5H9.5a3.5 3.5 0 0 0 0 7h5a3.5 3.5 0 0 1 0 7H6'></path>
    </svg>
  );
};

DollarIcon.propTypes = {
  width: PropTypes.number,
  height: PropTypes.number,
};

export default DollarIcon;