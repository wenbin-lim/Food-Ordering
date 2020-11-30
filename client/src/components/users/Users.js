import React, { useState, useEffect } from 'react';
import PropTypes from 'prop-types';
import { Outlet, useNavigate } from 'react-router-dom';

// Components
import Container from '../layout/Container';
import Dropdown from '../layout/Dropdown';
import List from '../layout/List';
import Button from '../layout/Button';
import FixedActionButtons from '../layout/FixedActionButtons';

import UserItem from './UserItem';

// Icons
import PlusIcon from '../icons/PlusIcon';

// Hooks
import useGet from '../../query/hooks/useGet';
import useErrors from '../../hooks/useErrors';

const Users = ({ user: { access: userAccess }, company: userCompanyId }) => {
  const navigate = useNavigate();

  const [company, setCompany] = useState(userCompanyId);

  const { data: companies, error: companiesError } = useGet('companies', {
    route: '/api/companies',
    enabled: userAccess === 99,
  });
  useErrors(companiesError);

  const {
    data: users,
    isFetching: usersLoading,
    error: usersError,
    refetch,
  } = useGet('users', {
    route: '/api/users',
    params: { company },
    enabled: company,
  });
  useErrors(usersError);

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
            loading={usersLoading}
            error={usersError}
            array={users}
            itemElement={<UserItem />}
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

Users.propTypes = {
  user: PropTypes.object,
  company: PropTypes.string,
};

export default Users;
