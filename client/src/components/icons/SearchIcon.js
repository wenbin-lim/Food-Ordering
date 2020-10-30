import React from 'react';
import PropTypes from 'prop-types';

const SearchIcon = ({ width = 24, height = 24 }) => {
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
      className='icon search-icon'
    >
      <circle cx='11' cy='11' r='8'></circle>
      <line x1='21' y1='21' x2='16.65' y2='16.65'></line>
    </svg>
  );
};

SearchIcon.propTypes = {
  width: PropTypes.number,
  height: PropTypes.number,
};

export default SearchIcon;
