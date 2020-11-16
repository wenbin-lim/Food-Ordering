import React from 'react';
import PropTypes from 'prop-types';

import { Outlet, useNavigate } from 'react-router-dom';

// Components
import Container from '../../../components/layout/Container';
import List from '../../../components/layout/List';
import CustomisationItem from '../../../components/customisations/CustomisationItem';

// Hooks
import useGetAll from '../../../query/hooks/useGetAll';
import useErrors from '../../../hooks/useErrors';

const CompanyCustomisations = ({ company }) => {
  const { data: customisations, isLoading, error } = useGetAll(
    'customisations',
    { company }
  );
  useErrors(error);

  const navigate = useNavigate();

  return (
    <Container sidesheet={true}>
      <Container.Parent className={'list-wrapper'}>
        <List
          loading={isLoading}
          listArr={customisations}
          listItem={<CustomisationItem />}
          addBtnCallback={() => navigate('add')}
        />
      </Container.Parent>

      <Container.Child className={'sidesheet'}>
        <Outlet />
      </Container.Child>
    </Container>
  );
};

CompanyCustomisations.propTypes = {
  company: PropTypes.string,
};

export default CompanyCustomisations;
