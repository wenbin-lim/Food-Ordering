import React from 'react';
import PropTypes from 'prop-types';

// Misc
import { v4 as uuid } from 'uuid';

const FoodBillIcon = ({
  width = 24,
  height = 24,
  active = false,
  showAlert = false,
}) => {
  const maskId = uuid();

  return (
    <svg
      xmlns='http://www.w3.org/2000/svg'
      width={width}
      height={height}
      viewBox='0 0 24 24'
      className='icon food-bill-icon'
    >
      {showAlert && (
        <defs>
          <mask id={maskId}>
            <rect width='100%' height='100%' fill='white' />
            <circle cx='20' cy='4' r='6' fill='black' />
          </mask>
        </defs>
      )}

      <rect
        x='1'
        y='4'
        width='22'
        height='16'
        rx='2'
        ry='2'
        fill='none'
        stroke={active ? 'var(--secondary)' : 'currentColor'}
        strokeWidth='2'
        strokeLinecap='round'
        strokeLinejoin='round'
        mask={showAlert ? `url(#${maskId})` : null}
      />
      <line
        x1='1'
        y1='10'
        x2='23'
        y2='10'
        fill='none'
        stroke={active ? 'var(--secondary)' : 'currentColor'}
        strokeWidth='2'
        strokeLinecap='round'
        strokeLinejoin='round'
      />

      {showAlert && <circle cx='20' cy='4' r='4' fill='var(--error)' />}
    </svg>
  );
};

FoodBillIcon.propTypes = {
  width: PropTypes.number,
  height: PropTypes.number,
  active: PropTypes.bool,
  showAlert: PropTypes.bool,
};

export default FoodBillIcon;
