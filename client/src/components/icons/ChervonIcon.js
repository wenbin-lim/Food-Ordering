import React from 'react';
import PropTypes from 'prop-types';

const ChervonIcon = ({ width = 24, height = 24 }) => {
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
      className='icon chervon-icon'
    >
      <polyline points='6 9 12 15 18 9'></polyline>
    </svg>
  );
};

ChervonIcon.propTypes = {
  width: PropTypes.number,
  height: PropTypes.number,
};

export default ChervonIcon;
