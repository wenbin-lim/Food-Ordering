import React from 'react';
import PropTypes from 'prop-types';

const FacebookIcon = ({ width = 24, height = 24 }) => {
  return (
    <svg
      xmlns='http://www.w3.org/2000/svg'
      width={width}
      height={height}
      viewBox='0 0 24 24'
      fill='currentColor'
      stroke='currentColor'
      strokeWidth='2'
      strokeLinecap='round'
      strokeLinejoin='round'
      className='icon facebookIcon'
    >
      <path d='M18 2h-3a5 5 0 0 0-5 5v3H7v4h3v8h4v-8h3l1-4h-4V7a1 1 0 0 1 1-1h3z'></path>
    </svg>
  );
};

FacebookIcon.propTypes = {
  width: PropTypes.number,
  height: PropTypes.number,
};

export default FacebookIcon;
