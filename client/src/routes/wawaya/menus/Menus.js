import React, { useState, useRef, useEffect } from 'react';
import { Outlet, useNavigate } from 'react-router-dom';

// Components
import Container from '../../../components/layout/Container';
import Tabs, { Tab } from '../../../components/layout/Tabs';
import List from '../../../components/layout/List';
import CompanyItem from '../companies/CompanyItem';
import MenuItem from '../../../components/menus/MenuItem';

// Hooks
import useGetAll from '../../../query/hooks/useGetAll';
import useErrors from '../../../hooks/useErrors';

const Menus = () => {
  const navigate = useNavigate();
  const tabsRef = useRef(null);
  const [company, setActiveCompany] = useState('');

  const {
    data: companies,
    isFetching: companiesLoading,
    error: companiesError,
  } = useGetAll('companies');
  useErrors(companiesError);

  const {
    data: menus,
    isFetching: menusLoading,
    error: menusError,
    refetch,
  } = useGetAll('menus', { company }, company);
  useErrors(menusError);

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
          <Tab name={'Menus'} className={'list-wrapper'}>
            <List
              loading={menusLoading}
              listArr={menus}
              listItem={<MenuItem />}
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

export default Menus;
