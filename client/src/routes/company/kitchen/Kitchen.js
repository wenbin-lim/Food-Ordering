import React, { useState, useEffect } from 'react';
import PropTypes from 'prop-types';

// Components
import Container from '../../../components/layout/Container';
import Button from '../../../components/layout/Button';
import Spinner from '../../../components/layout/Spinner';
import KitchenItem from './KitchenItem';

// Icons
import RefreshIcon from '../../../components/icons/RefreshIcon';

// Hooks
import useGet from '../../../query/hooks/useGet';
import useErrors from '../../../hooks/useErrors';

const Kitchen = ({ company }) => {
  const { data: orders, isLoading, isFetching, error, refetch } = useGet(
    'orders',
    {
      route: '/api/orders',
      params: { company },
      refetchInterval: 30000,
    }
  );
  useErrors(error);

  const [kitchenOrders, setKitchenOrders] = useState([]);

  useEffect(() => {
    if (Array.isArray(orders)) {
      let newOrders = orders
        .filter(
          order =>
            order.status === 'preparing' ||
            order.status === 'hold' ||
            order.status === 'cooking' ||
            order.status === 'ready'
        )
        .sort(
          (a, b) => new Date(a.bill.startTime) - new Date(b.bill.startTime)
        );

      // get all unique bills
      let uniqueBills = newOrders.map(order => order.bill);
      uniqueBills = [
        ...new Map(uniqueBills.map(bill => [bill['_id'], bill])).values(),
      ];

      let newKitchenOrders = [];
      uniqueBills.forEach(uniqueBill => {
        const { _id: billId } = uniqueBill;
        let ordersUnderThisBill = newOrders
          .filter(order => order?.bill?._id === billId)
          .sort((a, b) => new Date(b.date) - new Date(a.date));

        newKitchenOrders.push({
          bill: uniqueBill,
          orders: ordersUnderThisBill,
        });
      });

      setKitchenOrders(newKitchenOrders);
    }
  }, [orders]);

  return (
    <Container className='kitchen'>
      <section className='kitchen-orders'>
        {isLoading ? (
          <div>loading</div>
        ) : kitchenOrders.length > 0 ? (
          kitchenOrders.map(kitchenOrder => (
            <KitchenItem
              key={kitchenOrder.bill._id}
              kitchenOrder={kitchenOrder}
            />
          ))
        ) : (
          <p className='caption text-center'>No orders found</p>
        )}
      </section>
      <Button
        className='kitchen-refresh-btn'
        fill='contained'
        type='primary'
        icon={isFetching ? <Spinner height='2rem' /> : <RefreshIcon />}
        onClick={refetch}
      />
    </Container>
  );
};

Kitchen.propTypes = {
  company: PropTypes.string,
};

export default Kitchen;
