import React, { useState, useEffect } from 'react';
import PropTypes from 'prop-types';
import { Outlet, useNavigate } from 'react-router-dom';

// Components
import Container from '../layout/Container';
import Dropdown from '../layout/Dropdown';
import List from '../layout/List';
import Button from '../layout/Button';
import FixedActionButtons from '../layout/FixedActionButtons';

import TableItem from './TableItem';

// Icons
import PlusIcon from '../icons/PlusIcon';

// Hooks
import useGet from '../../query/hooks/useGet';
import useErrors from '../../hooks/useErrors';

const Tables = ({ user: { access: userAccess }, company: userCompanyId }) => {
  const navigate = useNavigate();

  const [company, setCompany] = useState(userCompanyId);

  const { data: companies, error: companiesError } = useGet('companies', {
    route: '/api/companies',
    enabled: userAccess === 99,
  });
  useErrors(companiesError);

  const {
    data: tables,
    isFetching: tablesLoading,
    error: tablesError,
    refetch,
  } = useGet('tables', {
    route: '/api/tables',
    params: { company },
    enabled: company,
  });
  useErrors(tablesError);

  useEffect(() => {
    company && refetch();

    // eslint-disable-next-line
  }, [company]);

  return (
    <Container sidesheet={true}>
      <Container.Parent>
        <List>
          {userAccess === 99 && (
            <List.Header>
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
            </List.Header>
          )}

          <List.Items
            loading={tablesLoading}
            error={tablesError}
            array={tables}
            itemElement={<TableItem />}
          />

          <FixedActionButtons>
            <Button
              fill='contained'
              type='primary'
              icon={<PlusIcon />}
              onClick={() => navigate('add')}
            />
          </FixedActionButtons>
        </List>
      </Container.Parent>

      <Container.Child className='sidesheet'>
        <Outlet />
      </Container.Child>
    </Container>
  );
};

Tables.propTypes = {
  table: PropTypes.object,
  company: PropTypes.string,
};

export default Tables;
