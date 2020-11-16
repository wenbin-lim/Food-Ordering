import React from 'react';
import PropTypes from 'prop-types';

import { Outlet, useNavigate } from 'react-router-dom';

// Components
import Container from '../../../components/layout/Container';
import List from '../../../components/layout/List';
import MenuItem from '../../../components/menus/MenuItem';

// Hooks
import useGetAll from '../../../query/hooks/useGetAll';
import useErrors from '../../../hooks/useErrors';

const CompanyMenus = ({ company }) => {
  const { data: menus, isLoading, error } = useGetAll('menus', { company });
  useErrors(error);

  const navigate = useNavigate();

  return (
    <Container sidesheet={true}>
      <Container.Parent className={'list-wrapper'}>
        <List
          loading={isLoading}
          listArr={menus}
          listItem={<MenuItem />}
          addBtnCallback={() => navigate('add')}
        />
      </Container.Parent>

      <Container.Child className={'sidesheet'}>
        <Outlet />
      </Container.Child>
    </Container>
  );
};

CompanyMenus.propTypes = {
  company: PropTypes.string,
};

export default CompanyMenus;
