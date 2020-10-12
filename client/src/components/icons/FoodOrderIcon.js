import React from 'react';
import PropTypes from 'prop-types';

// Misc
import { v4 as uuid } from 'uuid';

const FoodOrderIcon = ({
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
      className='icon food-order-icon'
    >
      {showAlert && (
        <defs>
          <mask id={maskId}>
            <rect width='100%' height='100%' fill='white' />
            <circle cx='20' cy='4' r='6' fill='black' />
          </mask>
        </defs>
      )}

      <path
        d='M16 4h2a2 2 0 0 1 2 2v14a2 2 0 0 1-2 2H6a2 2 0 0 1-2-2V6a2 2 0 0 1 2-2h2'
        stroke={active ? 'var(--secondary)' : 'currentColor'}
        fill='none'
        strokeWidth='2'
        strokeLinecap='round'
        strokeLinejoin='round'
        mask={showAlert ? `url(#${maskId})` : null}
      />

      <rect
        x='8'
        y='2'
        width='8'
        height='4'
        rx='1'
        ry='1'
        stroke={active ? 'var(--secondary)' : 'currentColor'}
        fill='none'
        strokeWidth='2'
        strokeLinecap='round'
        strokeLinejoin='round'
        mask={showAlert ? `url(#${maskId})` : null}
      />

      {showAlert && <circle cx='20' cy='4' r='4' fill='var(--error)' />}
    </svg>
  );
};

FoodOrderIcon.propTypes = {
  width: PropTypes.number,
  height: PropTypes.number,
  active: PropTypes.bool,
  showAlert: PropTypes.bool,
};

export default FoodOrderIcon;
