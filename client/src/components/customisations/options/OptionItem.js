import React, { Fragment } from 'react';
import PropTypes from 'prop-types';

// Components
import ListItem from '../../layout/ListItem';

const OptionItem = ({ actions, color = 'surface2', option }) => {
  const { name, price, availability } = { ...option };

  const priceStr = `${price < 0 ? '-' : '+'} ${Math.abs(price).toFixed(2)}`;

  return (
    <ListItem
      classes={'mb-h'}
      color={color}
      listContent={
        <Fragment>
          <p className='body-1'>{name}</p>
          {availability === false && (
            <span className='badge badge-error'>Unavailable</span>
          )}
        </Fragment>
      }
      afterListContent={<p className='body-2 pl-h pr-h'>{priceStr}</p>}
      actions={actions}
    />
  );
};

OptionItem.propTypes = {
  actions: PropTypes.arrayOf(
    PropTypes.shape({
      name: PropTypes.string.isRequired,
      path: PropTypes.string,
      callback: PropTypes.func,
    }).isRequired
  ),
  color: PropTypes.oneOf([
    'surface1',
    'surface2',
    'surface3',
    'primary',
    'secondary',
    'error',
    'success',
    'warning',
    'background',
  ]),
  option: PropTypes.object.isRequired,
};

export default OptionItem;
