import React from 'react';
import PropTypes from 'prop-types';

import { Outlet, useNavigate } from 'react-router-dom';

// Components
import Container from '../../../components/layout/Container';
import List from '../../../components/layout/List';
import TableItem from '../../../components/tables/TableItem';

// Hooks
import useGetAll from '../../../query/hooks/useGetAll';
import useErrors from '../../../hooks/useErrors';

const CompanyTables = ({ company }) => {
  const { data: tables, isLoading, error } = useGetAll('tables', { company });
  useErrors(error);

  const navigate = useNavigate();

  return (
    <Container sidesheet={true}>
      <Container.Parent className={'list-wrapper'}>
        <List
          loading={isLoading}
          listArr={tables}
          listItem={<TableItem />}
          addBtnCallback={() => navigate('add')}
        />
      </Container.Parent>

      <Container.Child className={'sidesheet'}>
        <Outlet />
      </Container.Child>
    </Container>
  );
};

CompanyTables.propTypes = {
  company: PropTypes.string,
};

export default CompanyTables;
