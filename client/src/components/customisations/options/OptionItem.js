import React from 'react';
import PropTypes from 'prop-types';

// Components
import ListItem, { Action } from '../../layout/ListItem';

const OptionItem = ({ actions, option }) => {
  const { name, price, availability } = { ...option };

  return (
    <ListItem>
      <ListItem.Content>
        <p className='body-1'>{name ? name : 'No name defined'}</p>
        {availability === false && (
          <span className='badge badge-small badge-error'>Unavailable</span>
        )}
      </ListItem.Content>
      <ListItem.After>
        <p className='body-2 pl-h pr-h'>{`${price < 0 ? '-' : '+'} ${Math.abs(
          price
        ).toFixed(2)}`}</p>
      </ListItem.After>
      {Array.isArray(actions) && actions.length > 0 && (
        <ListItem.Actions>
          {actions.map(({ name, callback }, index) => (
            <Action
              key={`action-${name}-${index}`}
              name={name}
              onClick={callback}
            />
          ))}
        </ListItem.Actions>
      )}
    </ListItem>
  );
};

OptionItem.propTypes = {
  actions: PropTypes.arrayOf(
    PropTypes.shape({
      name: PropTypes.string.isRequired,
      callback: PropTypes.func,
    }).isRequired
  ),
  option: PropTypes.object.isRequired,
};

export default OptionItem;
