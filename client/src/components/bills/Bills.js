import React, { useState, useEffect } from 'react';
import PropTypes from 'prop-types';
import { Outlet, useNavigate } from 'react-router-dom';

// Components
import Container from '../layout/Container';
import Dropdown from '../layout/Dropdown';
import List from '../layout/List';
import DatePicker from '../layout/DatePicker';
import Button from '../layout/Button';
import FixedActionButtons from '../layout/FixedActionButtons';

import BillItem from './BillItem';

// Icons
import PlusIcon from '../icons/PlusIcon';
import ArrowIcon from '../icons/ArrowIcon';

// Hooks
import useGet from '../../query/hooks/useGet';
import useErrors from '../../hooks/useErrors';

const Bills = ({ user: { access: userAccess }, company: userCompanyId }) => {
  const navigate = useNavigate();
  const [searchDate, setSearchDate] = useState(new Date());

  const [company, setCompany] = useState(userCompanyId);

  const { data: companies, error: companiesError } = useGet('companies', {
    route: '/api/companies',
    enabled: userAccess === 99,
  });
  useErrors(companiesError);

  const {
    data: bills,
    isFetching: billsLoading,
    error: billsError,
    refetch,
  } = useGet('bills', {
    route: '/api/bills',
    params: {
      company,
      type: 'byStartTime',
      startTime: searchDate,
    },
    enabled: company,
  });
  useErrors(billsError);

  useEffect(() => {
    company && refetch();

    // eslint-disable-next-line
  }, [company]);

  return (
    <Container sidesheet={true}>
      <Container.Parent>
        <List enableSearch={false}>
          <List.Header>
            {userAccess === 99 && (
              <Dropdown
                label='company'
                options={
                  Array.isArray(companies)
                    ? companies.map(company => ({
                        key: company?.displayedName,
                        value: company?._id,
                      }))
                    : []
                }
                value={company}
                onChangeHandler={({ value }) => setCompany(value)}
              />
            )}

            <div className='list-filter-group-with-btn'>
              <DatePicker
                label='search'
                min={new Date(2020, 1, 1)}
                value={searchDate}
                onChangeHandler={({ value }) => setSearchDate(value)}
              />
              <Button
                fill='contained'
                type='primary'
                icon={<ArrowIcon direction='right' />}
                onClick={() => refetch()}
              />
            </div>
          </List.Header>

          <List.Items
            loading={billsLoading}
            error={billsError}
            array={
              Array.isArray(bills)
                ? bills.sort((a, b) => {
                    if (a.status === 'settled' && b.status !== 'settled') {
                      return -1;
                    } else if (
                      a.status !== 'settled' &&
                      b.status === 'settled'
                    ) {
                      return 1;
                    } else {
                      return 0;
                    }
                  })
                : []
            }
            itemElement={<BillItem />}
          />
        </List>
      </Container.Parent>

      <Container.Child className='sidesheet'>
        <Outlet />
      </Container.Child>
    </Container>
  );
};

Bills.propTypes = {
  bill: PropTypes.object,
  company: PropTypes.string,
};

export default Bills;
