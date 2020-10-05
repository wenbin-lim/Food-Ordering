import React from 'react';
import PropTypes from 'prop-types';

const ArrowIcon = ({ width = 24, height = 24, direction = 'left' }) => {
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
      className={`icon arrow-icon arrow-icon-${direction}`}
    >
      <line x1='19' y1='12' x2='5' y2='12'></line>
      <polyline points='12 19 5 12 12 5'></polyline>
    </svg>
  );
};

ArrowIcon.propTypes = {
  width: PropTypes.number,
  height: PropTypes.number,
};

export default ArrowIcon;
