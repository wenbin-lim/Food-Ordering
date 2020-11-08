import React from 'react';
import PropTypes from 'prop-types';

const FoodIcon = ({ width = 24, height = 24 }) => {
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
      className='icon food-icon'
    >
      <path d='M8.36398 11.229L4.8638 7.72882C2.43313 5.29815 4.12134 2.74371 4.12134 2.74371L10.4853 9.10767L8.36398 11.229Z' />
      <rect
        x='9.41421'
        y='12.2792'
        width='3'
        height='14'
        rx='1'
        transform='rotate(-45 9.41421 12.2792)'
      />
      <rect
        x='4.53564'
        y='22.0167'
        width='3'
        height='10.3'
        rx='1'
        transform='rotate(-135 4.53564 22.0167)'
      />
      <path d='M13.5275 6.37299C13.73 6.17044 13.8726 6.12353 13.9591 6.11082C14.0553 6.09669 14.2044 6.10778 14.4393 6.21414C14.9564 6.44824 15.5749 6.9903 16.3639 7.77927C17.1528 8.56823 17.6949 9.18676 17.929 9.70383C18.0353 9.93875 18.0464 10.0878 18.0323 10.184C18.0196 10.2705 17.9726 10.4131 17.7701 10.6156C17.3405 11.0452 16.579 11.3612 15.719 11.385C14.8703 11.4086 14.0718 11.1441 13.5354 10.6077C12.999 10.0713 12.7345 9.2728 12.7581 8.42414C12.782 7.56409 13.0979 6.80259 13.5275 6.37299Z' />
      <line
        x1='1'
        y1='-1'
        x2='4.86351'
        y2='-1'
        transform='matrix(0.712373 -0.701801 0.712373 0.701801 15 6.85873)'
      />
      <line
        x1='1'
        y1='-1'
        x2='4.86351'
        y2='-1'
        transform='matrix(0.712373 -0.701801 0.712373 0.701801 16.79 8.62228)'
      />
      <line
        x1='1'
        y1='-1'
        x2='4.86351'
        y2='-1'
        transform='matrix(0.712373 -0.701801 0.712373 0.701801 18.5801 10.3859)'
      />
    </svg>
  );
};

FoodIcon.propTypes = {
  width: PropTypes.number,
  height: PropTypes.number,
};

export default FoodIcon;
