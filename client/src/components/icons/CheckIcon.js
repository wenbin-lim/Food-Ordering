import React from 'react';
import PropTypes from 'prop-types';

const CheckIcon = ({ width = 24, height = 24 }) => {
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
      className='icon checkIcon'
    >
      <polyline points='20 6 9 17 4 12'></polyline>
    </svg>
  );
};

CheckIcon.propTypes = {
  width: PropTypes.number,
  height: PropTypes.number,
};

export default CheckIcon;
