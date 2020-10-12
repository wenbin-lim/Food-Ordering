import React from 'react';
import PropTypes from 'prop-types';

const HomeIcon = ({ width = 24, height = 24, active = false }) => {
  return (
    <svg
      xmlns='http://www.w3.org/2000/svg'
      width={width}
      height={height}
      viewBox='0 0 24 24'
      className='icon home-icon'
    >
      <path
        d='M3 9l9-7 9 7v11a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2z'
        fill='none'
        stroke={active ? 'var(--secondary)' : 'currentColor'}
        strokeWidth='2'
        strokeLinecap='round'
        strokeLinejoin='round'
      />
      <polyline
        points='9 22 9 12 15 12 15 22'
        fill='none'
        stroke={active ? 'var(--secondary)' : 'currentColor'}
        strokeWidth='2'
        strokeLinecap='round'
        strokeLinejoin='round'
      />
    </svg>
  );
};

HomeIcon.propTypes = {
  width: PropTypes.number,
  height: PropTypes.number,
  active: PropTypes.bool,
};

export default HomeIcon;
