import React from 'react';
import PropTypes from 'prop-types';

const RemoveIcon = ({ width = 24, height = 24 }) => {
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
      className='icon remove-icon'
    >
      <circle cx='12' cy='12' r='10' />
      <line x1='5.29289' y1='18.2929' x2='18.2929' y2='5.29289' />
    </svg>
  );
};

RemoveIcon.propTypes = {
  width: PropTypes.number,
  height: PropTypes.number,
};

export default RemoveIcon;
