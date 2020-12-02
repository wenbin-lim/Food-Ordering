import React from 'react';
import PropTypes from 'prop-types';

import Moment from 'react-moment';

// Components
import ListItem, { Action } from '../layout/ListItem';

// Icons
import KitchenIcon from '../icons/KitchenIcon';
import HotelBellIcon from '../icons/HotelBellIcon';
import DollarIcon from '../icons/DollarIcon';

// Custom Hooks
import useDelete from '../../query/hooks/useDelete';

const NotificationItem = ({ data }) => {
  const { _id: notificationId, type, content, time } = data;
  const {
    tableName,
    remarks,
    foodName,
    optionsSelected,
    additionalInstruction,
    assistanceReason,
  } = { ...content };

  const [clearNotification] = useDelete('notifications', {
    route: `/api/notifications/${notificationId}`,
  });

  return (
    <ListItem>
      <ListItem.Content className='notification'>
        <div className='notification-header'>
          <div className='notification-type'>
            {(type === 'orderOnHold' || type === 'orderReady') && (
              <KitchenIcon />
            )}
            {type === 'customerHelp' && <HotelBellIcon />}
            {type === 'billReady' && <DollarIcon />}
          </div>

          <div className='notification-title'>Table {tableName}</div>
        </div>

        {(type === 'orderOnHold' || type === 'orderReady') && (
          <div className='notification-content'>
            <div className='notification-content-title'>{remarks}</div>

            <div className='notification-content-body'>
              <p className='body-1'>{foodName}</p>
              {Array.isArray(optionsSelected) &&
                optionsSelected.map((option, index) => (
                  <p key={`${option}_${index}`} className='body-2'>
                    {option}
                  </p>
                ))}
              <p className='body-2'>{additionalInstruction}</p>
            </div>
          </div>
        )}

        {type === 'customerHelp' && (
          <div className='notification-content'>
            <div className='notification-content-title'>{assistanceReason}</div>
            <div className='notification-content-body'>
              <p className='body-2'>{remarks}</p>
            </div>
          </div>
        )}

        {type === 'billReady' && (
          <div className='notification-content'>
            <div className='notification-content-title'>{remarks}</div>
          </div>
        )}

        <div className='notification-time'>
          <Moment fromNow>{time}</Moment>
        </div>
      </ListItem.Content>

      <ListItem.Actions>
        <Action name='Clear' onClick={() => clearNotification()} />
      </ListItem.Actions>
    </ListItem>
  );
};

NotificationItem.propTypes = {
  data: PropTypes.object,
};

export default NotificationItem;
