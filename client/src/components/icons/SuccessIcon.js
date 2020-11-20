import React from 'react';
import PropTypes from 'prop-types';

const SuccessIcon = ({ width, height }) => {
  return (
    <svg
      xmlns='http://www.w3.org/2000/svg'
      width={width ? width : '24'}
      height={height ? height : '24'}
      viewBox='0 0 24 24'
      fill='none'
      stroke='currentColor'
      strokeWidth='2'
      strokeLinecap='round'
      strokeLinejoin='round'
      className='icon success-icon'
    >
      <path d='M22 11.08V12a10 10 0 1 1-5.93-9.14'></path>
      <polyline points='22 4 12 14.01 9 11.01'></polyline>
    </svg>
  );
};

SuccessIcon.propTypes = {
  width: PropTypes.number,
  height: PropTypes.number,
};

export default SuccessIcon;
