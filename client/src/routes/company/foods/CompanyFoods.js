import React from 'react';
import PropTypes from 'prop-types';

import { Outlet, useNavigate } from 'react-router-dom';

// Components
import Container from '../../../components/layout/Container';
import List from '../../../components/layout/List';
import FoodItem from '../../../components/foods/FoodItem';

// Hooks
import useGetAll from '../../../query/hooks/useGetAll';
import useErrors from '../../../hooks/useErrors';

const CompanyFoods = ({ company }) => {
  const { data: foods, isLoading, error } = useGetAll('foods', { company });
  useErrors(error);

  const navigate = useNavigate();

  return (
    <Container sidesheet={true}>
      <Container.Parent className={'list-wrapper'}>
        <List
          loading={isLoading}
          listArr={foods}
          listItem={<FoodItem />}
          addBtnCallback={() => navigate('add')}
        />
      </Container.Parent>

      <Container.Child className={'sidesheet'}>
        <Outlet />
      </Container.Child>
    </Container>
  );
};

CompanyFoods.propTypes = {
  company: PropTypes.string,
};

export default CompanyFoods;
