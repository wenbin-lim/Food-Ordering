import React, { useState, useEffect } from 'react';

// Components
import Container from '../layout/Container';
import Button from '../layout/Button';
import Spinner from '../layout/Spinner';
import KitchenItem from './KitchenItem';

// Hooks
import useGet from '../../query/hooks/useGet';
import useErrors from '../../hooks/useErrors';

const Kitchen = () => {
  const { data: bills, isLoading, error } = useGet('bills', {
    route: '/api/bills',
    params: { type: 'unsettled' },
    refetchInterval: 30000,
  });
  useErrors(error);

  return (
    <Container className='kitchen'>
      {isLoading ? (
        <Spinner />
      ) : Array.isArray(bills) && bills.length > 0 ? (
        <article className='kitchen-orders'>
          {bills.map(bill => (
            <KitchenItem key={bill._id} bill={bill} />
          ))}
        </article>
      ) : (
        <p className='caption text-center'>No orders found</p>
      )}
    </Container>
  );
};

export default Kitchen;
