import React, { useState, useEffect } from 'react';
import PropTypes from 'prop-types';

// Components
import OrderItem from '../orders/OrderItem';

// Hooks
import useGetOne from '../../query/hooks/useGetOne';
import useErrors from '../../hooks/useErrors';

const KitchenItem = ({ bill }) => {
  const { _id: billId, table } = bill;

  const { data: orders, error } = useGetOne('orders', billId, {
    route: '/api/orders',
    params: { bill: billId },
    refetchInterval: 30000,
  });
  useErrors(error);

  const [validOrders, setValidOrders] = useState([]);

  useEffect(() => {
    if (Array.isArray(orders)) {
      setValidOrders(
        orders.filter(
          ({ currentStatus }) =>
            currentStatus === 'preparing' ||
            currentStatus === 'cooking' ||
            currentStatus === 'hold' ||
            currentStatus === 'ready' ||
            currentStatus === 'updated'
        )
      );
    }
    // eslint-disable-next-line
  }, [orders]);

  return validOrders.length > 0 ? (
    <article className='kitchenitem'>
      <header className='kitchenitem-header'>
        <h3 className='kitchenitem-table-name'>
          Table {table?.name ? table.name : ''}
        </h3>
      </header>
      <section className='kitchenitem-orders'>
        {validOrders.map(order => (
          <OrderItem key={order._id} data={order} accessRole='kitchen' />
        ))}
      </section>
    </article>
  ) : null;
};

KitchenItem.propTypes = {
  bill: PropTypes.object,
};

export default KitchenItem;
