import React, { useState, useRef, useEffect } from 'react';
import { Outlet, useNavigate } from 'react-router-dom';

// Components
import Container from '../../../components/layout/Container';
import Tabs, { Tab } from '../../../components/layout/Tabs';
import List from '../../../components/layout/List';
import CompanyItem from '../companies/CompanyItem';
import FoodItem from '../../../components/foods/FoodItem';

// Hooks
import useGet from '../../../query/hooks/useGet';
import useErrors from '../../../hooks/useErrors';

const Foods = () => {
  const navigate = useNavigate();
  const tabsRef = useRef(null);
  const [company, setActiveCompany] = useState('');

  const {
    data: companies,
    isFetching: companiesLoading,
    error: companiesError,
  } = useGet('companies', { route: '/api/companies' });
  useErrors(companiesError);

  const {
    data: foods,
    isFetching: foodsLoading,
    error: foodsError,
    refetch,
  } = useGet('foods', {
    route: '/api/foods',
    params: { company },
    enabled: company,
  });
  useErrors(foodsError);

  const onClickCompanyItem = companyId => setActiveCompany(companyId);

  useEffect(() => {
    company && refetch() && tabsRef.current?.setActiveTab(1);

    // eslint-disable-next-line
  }, [company]);

  return (
    <Container sidesheet={true}>
      <Container.Parent>
        <Tabs ref={tabsRef}>
          <Tab name={'Companies'} className={'list-wrapper'}>
            <List
              loading={companiesLoading}
              listArr={companies}
              listItem={<CompanyItem onClick={onClickCompanyItem} />}
            />
          </Tab>
          <Tab name={'Foods'} className={'list-wrapper'}>
            <List
              loading={foodsLoading}
              listArr={foods}
              listItem={<FoodItem />}
              addBtnCallback={() => navigate('add')}
            />
          </Tab>
        </Tabs>
      </Container.Parent>

      <Container.Child className={'sidesheet'}>
        <Outlet />
      </Container.Child>
    </Container>
  );
};

export default Foods;
