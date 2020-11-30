import React, { useState, useEffect } from 'react';
import { Outlet } from 'react-router-dom';

// Components
import Container from '../layout/Container';
import Button from '../layout/Button';
import ListPreloader from '../preloaders/ListPreloader';
import CashierItem from './CashierItem';

// Icons
import PlusIcon from '../icons/PlusIcon';

// Hooks
import useGet from '../../query/hooks/useGet';
import useErrors from '../../hooks/useErrors';

const Cashier = () => {
  const { data: bills, isLoading: billsLoading, error: billsError } = useGet(
    'bills',
    {
      route: '/api/bills',
      params: { type: 'unsettled' },
      refetchInterval: 30000,
    }
  );
  useErrors(billsError);

  return (
    <Container sidesheet={true}>
      <Container.Parent className='cashier'>
        <header className='cashier-header'>
          <h3 className='heading-3'>Bills</h3>
          <div className='totalbill'>
            <span className='totalbill-text'>Total</span>
            <span className='totalbill-number'>
              {Array.isArray(bills) ? bills.length : ''}
            </span>
          </div>
          <div className='readyforbill'>
            <span className='readyforbill-text'>Ready for bill</span>
            <span className='readyforbill-number'>
              {Array.isArray(bills)
                ? bills.filter(bill => bill.status === 'ready').length
                : ''}
            </span>
          </div>
        </header>

        {billsLoading || billsError ? (
          <ListPreloader />
        ) : (
          <article className='cashier-bills'>
            {Array.isArray(bills) && bills.length > 0 ? (
              bills
                .sort((a, b) => new Date(a.startTime) - new Date(b.startTime))
                .sort((a, b) => {
                  // sort ready bills on top
                  if (a.status === 'ready' && b.status !== 'ready') {
                    return -1;
                  } else if (a.status !== 'ready' && b.status === 'ready') {
                    return 1;
                  } else {
                    return 0;
                  }
                })
                .map(bill => <CashierItem key={bill._id} bill={bill} />)
            ) : (
              <p className='caption text-center'>No bills found</p>
            )}
          </article>
        )}

        <Button
          className='cashier-add-btn'
          fill='contained'
          type='primary'
          icon={<PlusIcon />}
        />
      </Container.Parent>

      <Container.Child className='sidesheet'>
        <Outlet />
      </Container.Child>
    </Container>
  );
};

Cashier.propTypes = {};

export default Cashier;
