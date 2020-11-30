import React from 'react';
import PropTypes from 'prop-types';

const TrashIcon = ({ width = 24, height = 24 }) => {
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
      className='icon info-icon'
    >
      <polyline points='3 6 5 6 21 6'></polyline>
      <path d='M19 6v14a2 2 0 0 1-2 2H7a2 2 0 0 1-2-2V6m3 0V4a2 2 0 0 1 2-2h4a2 2 0 0 1 2 2v2'></path>
    </svg>
  );
};

TrashIcon.propTypes = {
  width: PropTypes.number,
  height: PropTypes.number,
};

export default TrashIcon;
