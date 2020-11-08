import React from 'react';
import PropTypes from 'prop-types';

const FlipBookIcon = ({ width = 24, height = 24 }) => {
  return (
    <svg
      xmlns='http://www.w3.org/2000/svg'
      width={width}
      height={height}
      viewBox='0 0  24 24'
      fill='none'
      stroke='currentColor'
      strokeWidth='2'
      strokeLinecap='round'
      strokeLinejoin='round'
      className='icon flip-book-icon'
    >
      <rect x='6' y='7' width='15' height='14' rx='1' />
      <circle cx='4.5' cy='7.5' r='1.5' />
      <circle cx='4.5' cy='13.5' r='1.5' />
      <circle cx='4.5' cy='19.5' r='1.5' />
      <path d='M6 6.99999L17.3064 2.95621C18.6091 2.49032 19.98 3.45596 19.98 4.83941L19.98 7.00001' />
    </svg>
  );
};

FlipBookIcon.propTypes = {
  width: PropTypes.number,
  height: PropTypes.number,
};

export default FlipBookIcon;
