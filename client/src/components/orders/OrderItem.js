import React, { useState, useEffect, Fragment } from 'react';
import PropTypes from 'prop-types';

import Moment from 'react-moment';

// Components
import ListItem from '../layout/ListItem';

const OrderItem = ({ order, showStatus = false, actions }) => {
  const {
    food,
    quantity,
    price,
    customisations,
    additionalInstruction,
    status,
    date,
  } = order;
  const { name: foodName } = { ...food };

  const [chosenOptions, setChosenOptions] = useState([]);

  useEffect(() => {
    let newChosenOptions = [];

    if (Array.isArray(customisations) && customisations.length > 0) {
      customisations.forEach(selectedCustomisation => {
        const { customisation, optionsChosen } = selectedCustomisation;
        const { options: availableOptions } = customisation;

        if (Array.isArray(optionsChosen) && optionsChosen.length > 0) {
          optionsChosen.forEach(chosenOptionId => {
            if (
              Array.isArray(availableOptions) &&
              availableOptions.length > 0
            ) {
              const chosenOption = availableOptions.find(
                option => option._id.toString() === chosenOptionId
              );

              if (chosenOption && chosenOption.name) {
                newChosenOptions.push(chosenOption.name);
              }
            }
          });
        }
      });
    }

    setChosenOptions(newChosenOptions);
  }, [customisations]);

  const statusColor = status => {
    switch (status) {
      case 'added':
      case 'preparing':
      case 'ready':
        return 'warning';
      case 'on hold':
      case 'cancelled':
      case 'rejected':
      case 'removed':
        return 'error';
      case 'served':
        return 'success';
      default:
        break;
    }
  };

  return (
    <ListItem
      color={'surface2'}
      listContentClass={'orderitem'}
      listContent={
        <Fragment>
          {showStatus && (
            <div className='orderitem-statusbar'>
              <div className={`orderitem-status-${statusColor(status)}`}></div>
              <span className='orderitem-date'>
                <Moment local format='hh:mmA'>
                  {date}
                </Moment>
              </span>
            </div>
          )}
          <div className='orderitem-info'>
            <p className='orderitem-info-name'>{foodName}</p>
            {chosenOptions.map((option, index) => (
              <p
                key={`option-${option}-${index}`}
                className='orderitem-info-customisation'
              >
                {option}
              </p>
            ))}
            {additionalInstruction && (
              <span className='orderitem-info-additionalinstruction'>
                {additionalInstruction}
              </span>
            )}
          </div>
          <div className='orderitem-qty'>x{quantity}</div>
          <div className='orderitem-price'>${price.toFixed(2)}</div>
        </Fragment>
      }
      actions={actions}
    />
  );
};

OrderItem.propTypes = {
  order: PropTypes.object.isRequired,
};

export default OrderItem;
