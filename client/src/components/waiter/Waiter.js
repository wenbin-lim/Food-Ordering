import React, { useState, useEffect } from 'react';
import { Outlet } from 'react-router-dom';

// Components
import Container from '../layout/Container';
import Button from '../layout/Button';
import WaiterItem from './WaiterItem';
import ListPreloader from '../preloaders/ListPreloader';

// Icons
import PlusIcon from '../icons/PlusIcon';

// Hooks
import useGet from '../../query/hooks/useGet';
import useErrors from '../../hooks/useErrors';

const Waiter = () => {
  const [occupiedTables, setOccupiedTables] = useState([]);
  const [emptyTables, setEmptyTables] = useState([]);

  const { data: tables, isLoading: tablesLoading, error: tablesError } = useGet(
    'tables',
    {
      route: '/api/tables',
      refetchInterval: 30000,
    }
  );
  useErrors(tablesError);

  useEffect(() => {
    if (Array.isArray(tables)) {
      setOccupiedTables(tables.filter(table => table.bill));
      setEmptyTables(tables.filter(table => !table.bill));
    }
  }, [tables]);

  return (
    <Container sidesheet={true}>
      <Container.Parent className='waiter'>
        <header className='waiter-header'>
          <h3 className='heading-3'>Tables</h3>
          <div className='occupied'>
            <span className='occupied-text'>Occupied</span>
            <span className='occupied-number'>{occupiedTables.length}</span>
          </div>
          <div className='empty'>
            <span className='empty-text'>Empty</span>
            <span className='empty-number'>{emptyTables.length}</span>
          </div>
        </header>

        {tablesLoading || tablesError ? (
          <ListPreloader />
        ) : (
          <article className='waiter-tables'>
            {Array.isArray(tables) && tables.length > 0 ? (
              tables.map(table => <WaiterItem key={table._id} table={table} />)
            ) : (
              <p className='caption text-center'>No tables found</p>
            )}
          </article>
        )}

        <Button
          className='waiter-notification-btn'
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

export default Waiter;
