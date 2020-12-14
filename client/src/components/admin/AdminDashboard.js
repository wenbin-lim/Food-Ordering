import React, { useState, useEffect } from 'react';

import { startOfDay, endOfDay } from 'date-fns';

// Components
import Container from '../layout/Container';
import Tabs, { Tab } from '../layout/Tabs';

// Hooks
import useGet from '../../query/hooks/useGet';
import useErrors from '../../hooks/useErrors';

const AdminDashboard = () => {
  const { data: bills, isLoading: billsLoading, error: billsError } = useGet(
    'bills',
    {
      route: '/api/bills',
      refetchInterval: 600000,
    }
  );
  useErrors(billsError);

  const { data: tables, isLoading: tablesLoading, error: tablesError } = useGet(
    'tables',
    {
      route: '/api/tables',
      refetchInterval: 600000,
    }
  );
  useErrors(tablesError);

  const [todaySales, setTodaySales] = useState(0);
  const [allTimeSales, setAllTimeSales] = useState(0);

  const [totalTables, setTotalTables] = useState(0);
  const [emptyTables, setEmptyTables] = useState(0);
  const [occupiedTables, setOccupiedTables] = useState(0);

  useEffect(() => {
    const currentTime = new Date();
    const startOfToday = startOfDay(currentTime);
    const endOfToday = endOfDay(currentTime);

    if (Array.isArray(bills) && bills.length > 0) {
      const todayBills = bills.filter(
        ({ startTime }) =>
          new Date(startTime).getTime() >= startOfToday.getTime() &&
          new Date(startTime).getTime() <= endOfToday.getTime()
      );

      // get today sales
      setTodaySales(
        todayBills.reduce((result, item) => (result += item.total), 0)
      );

      // can incoporate weekly and monthly in future

      // get all time sales
      setAllTimeSales(
        bills.reduce((result, item) => (result += item.total), 0)
      );
    }

    if (Array.isArray(tables) && tables.length > 0) {
      const numOfTables = tables.length;
      const numOfOccupiedTables = tables.filter(({ bill }) => bill).length;
      const numOfEmptyTables = numOfTables - numOfOccupiedTables;

      setTotalTables(numOfTables);
      setEmptyTables(numOfEmptyTables);
      setOccupiedTables(numOfOccupiedTables);
    }

    // eslint-disable-next-line
  }, [bills, billsLoading, tables, tablesLoading]);

  return (
    <Container className='admindashboard'>
      <section className='admindashboard-card'>
        <header className='admindashboard-card-title'>Sales</header>
        <article className='admindashboard-card-content'>
          <Tabs className='sales' justifyTab='center'>
            <Tab name='Today'>
              <article className='sales-today'>
                <h1 className='heading-1'>${todaySales.toFixed(2)}</h1>
              </article>
            </Tab>
            <Tab name='All Time'>
              <article className='sales-alltime'>
                <h1 className='heading-1'>${allTimeSales.toFixed(2)}</h1>
              </article>
            </Tab>
          </Tabs>
        </article>
      </section>

      <section className='admindashboard-card'>
        <header className='admindashboard-card-title'>Tables</header>
        <article className='admindashboard-card-content'>
          <div className='row'>
            <p className='caption col-8'>Total</p>
            <p className='body-1 col text-right'>{totalTables}</p>
          </div>
          <div className='row'>
            <p className='caption col-8'>Occupied</p>
            <p className='body-1 col text-right'>{occupiedTables}</p>
          </div>
          <div className='row'>
            <p className='caption col-8'>Empty</p>
            <p className='body-1 col text-right'>{emptyTables}</p>
          </div>
        </article>
      </section>
    </Container>
  );
};

AdminDashboard.propTypes = {};

export default AdminDashboard;
