import React from 'react';
import PropTypes from 'prop-types';

const ImageIcon = ({ width = 24 }) => {
  return (
    <svg
      xmlns='http://www.w3.org/2000/svg'
      width={width}
      height={width}
      viewBox='0 0 24 24'
      fill='none'
      stroke='currentColor'
      strokeWidth='2'
      strokeLinecap='round'
      strokeLinejoin='round'
      className='icon image-icon'
    >
      <rect x='3' y='3' width='18' height='18' rx='2' ry='2'></rect>
      <circle cx='8.5' cy='8.5' r='1.5'></circle>
      <polyline points='21 15 16 10 5 21'></polyline>
    </svg>
  );
};

ImageIcon.propTypes = {
  width: PropTypes.number,
  height: PropTypes.number,
};

export default ImageIcon;
