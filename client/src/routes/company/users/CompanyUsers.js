import React from 'react';
import PropTypes from 'prop-types';

import { Outlet, useNavigate } from 'react-router-dom';

// Components
import Container from '../../../components/layout/Container';
import List from '../../../components/layout/List';
import UserItem from '../../../components/users/UserItem';

// Hooks
import useGetAll from '../../../query/hooks/useGetAll';
import useErrors from '../../../hooks/useErrors';

const CompanyUsers = ({ company }) => {
  const { data: users, isLoading, error } = useGetAll('users', { company });
  useErrors(error);

  const navigate = useNavigate();

  return (
    <Container sidesheet={true}>
      <Container.Parent className={'list-wrapper'}>
        <List
          loading={isLoading}
          listArr={users}
          listItem={<UserItem />}
          addBtnCallback={() => navigate('add')}
        />
      </Container.Parent>

      <Container.Child className={'sidesheet'}>
        <Outlet />
      </Container.Child>
    </Container>
  );
};

CompanyUsers.propTypes = {
  company: PropTypes.string,
};

export default CompanyUsers;
