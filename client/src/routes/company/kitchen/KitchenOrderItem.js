import React, { useRef, Fragment } from 'react';
import PropTypes from 'prop-types';

import Moment from 'react-moment';

// Components
import ListItem, { Action } from '../../../components/layout/ListItem';

// Custom Hooks
import useErrors from '../../../hooks/useErrors';
import usePut from '../../../query/hooks/usePut';

// Misc
import checkIfSameDate from '../../../utils/checkIfSameDate';

const KitchenOrderItem = ({ order }) => {
  const listItemRef = useRef(null);
  const {
    _id: orderId,
    food,
    quantity,
    price,
    customisationsUsed,
    additionalInstruction,
    status,
    date,
    bill,
  } = order;
  const { name: foodName } = { ...food };

  const getStatusColor = status => {
    switch (status) {
      case 'preparing':
        if (new Date().getTime() - new Date(date).getTime() < 300000) {
          return 'focus';
        }
        break;
      case 'cooking':
        return 'warning';
      case 'hold':
        return 'error';
      case 'ready':
        return 'success';
      default:
        break;
    }
  };

  const [editOrder, { error }] = usePut('orders', {
    route: `/api/orders/${orderId}`,
  });
  useErrors(error);

  const updateOrder = async newStatus => {
    await editOrder({
      food: food._id,
      quantity,
      customisationsUsed,
      additionalInstruction,
      price,
      status: newStatus,
      bill: bill?._id,
    });
  };

  return (
    <Fragment>
      <ListItem ref={listItemRef} className='kitchenorderitem'>
        <ListItem.Content className='kitchenorderitem-content'>
          <div className='kitchenorderitem-statusbar'>
            <div
              className={`kitchenorderitem-status-${getStatusColor(status)}`}
            />
            <span className='kitchenorderitem-time'>
              ordered at{' '}
              <Moment
                local
                format={checkIfSameDate(date) ? 'HH:mmA' : 'HH:mmA, DD MMM'}
              >
                {date}
              </Moment>
            </span>
          </div>
          <div className='kitchenorderitem-info'>
            <p className='kitchenorderitem-info-name'>{foodName}</p>
            {customisationsUsed.map(({ optionsSelected }) =>
              optionsSelected.map(({ _id: optionId, name }) => (
                <p
                  key={optionId}
                  className='kitchenorderitem-info-customisation'
                >
                  - {name}
                </p>
              ))
            )}
            {additionalInstruction && (
              <p className='kitchenorderitem-info-additionalinstruction'>
                - {additionalInstruction}
              </p>
            )}
          </div>
        </ListItem.Content>
        <ListItem.After>x {quantity}</ListItem.After>
        <ListItem.Actions>
          <Action
            name='Manage'
            // onClick={() => setshowOrderDialog(true)}
          />
          <Action name='Cook' onClick={() => updateOrder('cooking')} />
          <Action name='Serve' onClick={() => updateOrder('ready')} />
        </ListItem.Actions>
      </ListItem>
    </Fragment>
  );
};

KitchenOrderItem.propTypes = {
  order: PropTypes.object,
};

export default KitchenOrderItem;
