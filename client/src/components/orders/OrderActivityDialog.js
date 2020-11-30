import React, { useRef } from 'react';
import PropTypes from 'prop-types';

import Moment from 'react-moment';

// Components
import Dialog from '../layout/Dialog';
import Button from '../layout/Button';

// Icons
import CloseIcon from '../icons/CloseIcon';

const OrderActivityDialog = ({ order, onCloseOrderActivityDialog }) => {
  const dialogRef = useRef(null);

  const { activities, food, isAdditionalItem, additionalItemName } = order;

  const getStatusColor = status => {
    switch (status) {
      case 'new':
      case 'updated':
      case 'preparing':
        return 'focus';
      case 'cooking':
        return 'warning';
      case 'hold':
      case 'cancelled':
      case 'rejected':
      case 'removed':
        return 'error';
      case 'ready':
      case 'served':
        return 'success';
      default:
        return '';
    }
  };

  const getStatusMsg = activity => {
    const { status, user } = activity;

    switch (status) {
      case 'new':
        return 'ORDERED BY CUSTOMER';
      case 'preparing':
        return `ORDER SENT TO KITCHEN${
          user ? ` BY ${user.name.toUpperCase()}` : ''
        }`;
      case 'cooking':
        return `${user.name.toUpperCase()} STARTS COOKING`;
      case 'ready':
        return `${user.name.toUpperCase()} FINISHES COOKING`;
      case 'served':
        return `SERVED BY ${user.name.toUpperCase()}`;
      case 'updated':
        return `UPDATED BY ${user.name.toUpperCase()}`;
      case 'hold':
        return `PUT ON HOLD BY ${user.name.toUpperCase()}`;
      case 'cancelled':
        return `CANCELLED BY ${user.name.toUpperCase()}`;
      case 'rejected':
        return `REJECTED BY ${user.name.toUpperCase()}`;
      case 'removed':
        return `REMOVED BY ${user.name.toUpperCase()}`;
      default:
        return '';
    }
  };

  return (
    <Dialog
      ref={dialogRef}
      className='orderactivitydialog'
      onCloseDialog={onCloseOrderActivityDialog}
    >
      <header className='orderactivitydialog-header'>
        <Button
          className='orderactivitydialog-close-btn'
          icon={<CloseIcon />}
          onClick={() => dialogRef.current?.closeDialog()}
        />
        <h3 className='orderactivitydialog-header-title'>
          {isAdditionalItem ? additionalItemName : food.name}
        </h3>
      </header>

      <section className='orderactivitydialog-content'>
        {Array.isArray(activities) && activities.length > 0 ? (
          activities.map(activity => (
            <div
              key={activity._id}
              className={`activity-group activity-group-${getStatusColor(
                activity.status
              )}`}
            >
              <p className='activity-msg'>{getStatusMsg(activity)}</p>
              <p className='activity-remarks'>{activity.remarks}</p>
              <p className='activity-date'>
                <Moment local format='HH:mmA, DD MMM'>
                  {activity.date}
                </Moment>
              </p>
            </div>
          ))
        ) : (
          <p className='caption text-center'>Nothing found...</p>
        )}
      </section>
    </Dialog>
  );
};

OrderActivityDialog.propTypes = {
  order: PropTypes.object,
  onCloseOrderActivityDialog: PropTypes.func,
};

export default OrderActivityDialog;
