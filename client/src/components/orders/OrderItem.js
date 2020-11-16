import React, { useState, Fragment } from 'react';
import PropTypes from 'prop-types';
import { useDispatch } from 'react-redux';

import Moment from 'react-moment';

// Actions
import { setSnackbar } from '../../actions/app';

// Components
import ListItem, { Action } from '../layout/ListItem';
import OrderDialog from './OrderDialog';

// Custom Hooks
import useErrors from '../../hooks/useErrors';
import useDeleteOne from '../../query/hooks/useDeleteOne';

const OrderItem = ({ data, showStatus = false, editable }) => {
  const dispatch = useDispatch();

  const [deleteOrder, { error }] = useDeleteOne('orders');
  useErrors(error);

  const {
    _id: orderId,
    food,
    quantity,
    price,
    customisationsUsed,
    additionalInstruction,
    status,
    date,
  } = data;
  const { name: foodName } = { ...food };

  const [showOrderDialog, setshowOrderDialog] = useState(false);

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

  const onOrderDelete = async () => {
    const deleteOrderSuccess = await deleteOrder(orderId);

    return (
      deleteOrderSuccess && dispatch(setSnackbar('Order deleted!', 'success'))
    );
  };

  return (
    <Fragment>
      <ListItem>
        <ListItem.Content className='orderitem'>
          {showStatus && (
            <div className='orderitem-statusbar'>
              <div className={`orderitem-status-${statusColor(status)}`}></div>
              <span className='orderitem-date'>
                ordered at{' '}
                <Moment local format='hh:mmA'>
                  {date}
                </Moment>
              </span>
            </div>
          )}
          <div className='orderitem-info'>
            <p className='orderitem-info-name'>{foodName}</p>
            {customisationsUsed.map(({ optionsSelected }) =>
              optionsSelected.map(({ _id: optionId, name }) => (
                <p key={optionId} className='orderitem-info-customisation'>
                  {name}
                </p>
              ))
            )}
            {additionalInstruction && (
              <span className='orderitem-info-additionalinstruction'>
                {additionalInstruction}
              </span>
            )}
          </div>
          <div className='orderitem-qty'>x{quantity}</div>
          <div className='orderitem-price'>${price.toFixed(2)}</div>
        </ListItem.Content>
        {editable && (
          <ListItem.Actions>
            <Action name='Edit' onClick={() => setshowOrderDialog(true)} />
            <Action name='Delete' onClick={onOrderDelete} />
          </ListItem.Actions>
        )}
      </ListItem>
      {showOrderDialog && (
        <OrderDialog
          foodDetails={food}
          order={data}
          onCloseOrderDialog={() => setshowOrderDialog(false)}
        />
      )}
    </Fragment>
  );
};

OrderItem.propTypes = {
  data: PropTypes.object,
  showStatus: PropTypes.bool,
  editable: PropTypes.bool,
};

export default OrderItem;
