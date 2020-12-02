import React, { useState, useEffect } from 'react';
import PropTypes from 'prop-types';

// Components
import Container from '../layout/Container';
import Tabs, { Tab } from '../layout/Tabs';

import NotificationItem from './NotificationItem';

// Hooks
import useGet from '../../query/hooks/useGet';
import useErrors from '../../hooks/useErrors';

const Notifications = ({
  company,
  user: { access: userAccess, role: userRole },
}) => {
  const { data: notifications, isFetching, error } = useGet('notifications', {
    route: '/api/notifications',
    params: { company },
    refetchInterval: 10000,
  });
  useErrors(error);

  const [notificationsFromKitchen, setNotificationsFromKitchen] = useState([]);
  const [notificationsFromCustomer, setNotificationsFromCustomer] = useState(
    []
  );

  useEffect(() => {
    if (Array.isArray(notifications)) {
      setNotificationsFromKitchen(
        notifications.filter(
          ({ type }) => type === 'orderOnHold' || type === 'orderReady'
        )
      );

      setNotificationsFromCustomer(
        notifications.filter(
          ({ type }) => type === 'customerHelp' || type === 'billReady'
        )
      );
    }

    // eslint-disable-next-line
  }, [isFetching]);

  return (
    <Container>
      <Tabs>
        <Tab name='Customer'>
          {notificationsFromCustomer.map(notification => (
            <NotificationItem key={notification._id} data={notification} />
          ))}
        </Tab>
        {(userAccess === 3 || userRole.indexOf('waiter')) >= 0 && (
          <Tab name='Kitchen'>
            {notificationsFromKitchen.map(notification => (
              <NotificationItem key={notification._id} data={notification} />
            ))}
          </Tab>
        )}
      </Tabs>
    </Container>
  );
};

Notifications.propTypes = {
  company: PropTypes.string,
  user: PropTypes.object,
};

export default Notifications;
