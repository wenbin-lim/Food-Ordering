import React from 'react';
import PropTypes from 'prop-types';

const ErrorIcon = ({ width, height }) => {
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
      className='icon error-icon'
    >
      <polygon points='7.86 2 16.14 2 22 7.86 22 16.14 16.14 22 7.86 22 2 16.14 2 7.86 7.86 2'></polygon>
      <line x1='15' y1='9' x2='9' y2='15'></line>
      <line x1='9' y1='9' x2='15' y2='15'></line>
    </svg>
  );
};

ErrorIcon.propTypes = {
  width: PropTypes.number,
  height: PropTypes.number,
};

export default ErrorIcon;
