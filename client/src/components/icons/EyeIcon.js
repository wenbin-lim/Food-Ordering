import React from 'react';
import PropTypes from 'prop-types';

const EyeIcon = ({ width = 24, height = 24 }) => {
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
      className='icon eye-icon'
    >
      <path d='M1 12s4-8 11-8 11 8 11 8-4 8-11 8-11-8-11-8z'></path>
      <circle cx='12' cy='12' r='3'></circle>
    </svg>
  );
};

EyeIcon.propTypes = {
  width: PropTypes.number,
  height: PropTypes.number,
};

export default EyeIcon;
