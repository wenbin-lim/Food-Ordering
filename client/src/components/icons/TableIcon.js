import React from 'react';
import PropTypes from 'prop-types';

const TableIcon = ({ width = 24, height = 24 }) => {
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
      className='icon table-icon'
    >
      <path d='M22 5C22 5.15118 21.9189 5.42452 21.4836 5.7987C21.0517 6.17008 20.3681 6.54985 19.4364 6.88863C17.5814 7.56321 14.9523 8 12 8C9.04768 8 6.41865 7.56321 4.56357 6.88863C3.63192 6.54985 2.94833 6.17008 2.51636 5.7987C2.08113 5.42452 2 5.15118 2 5C2 4.84882 2.08113 4.57548 2.51636 4.2013C2.94833 3.82992 3.63192 3.45015 4.56357 3.11137C6.41865 2.43679 9.04768 2 12 2C14.9523 2 17.5814 2.43679 19.4364 3.11137C20.3681 3.45015 21.0517 3.82992 21.4836 4.2013C21.9189 4.57548 22 4.84882 22 5Z' />
      <path d='M22 5V8C22 9.65685 16.9706 11 12 11C7.02944 11 2 9.65685 2 8V5' />
      <path d='M16 20.0988C16 20.9267 14.8009 21 12.0876 21C9.37436 21 8 20.9267 8 20.0988C8 19.2708 9.87851 18 12.0876 18C14.2968 18 16 19.2708 16 20.0988Z' />
      <line x1='10' y1='11' x2='10' y2='18' />
      <line x1='14' y1='11' x2='14' y2='18' />
    </svg>
  );
};

TableIcon.propTypes = {
  width: PropTypes.number,
  height: PropTypes.number,
};

export default TableIcon;
