import React, { useState, useRef, useEffect } from 'react';
import { Outlet, useNavigate } from 'react-router-dom';

// Components
import Container from '../../../components/layout/Container';
import Tabs, { Tab } from '../../../components/layout/Tabs';
import List from '../../../components/layout/List';
import CompanyItem from '../companies/CompanyItem';
import UserItem from '../../../components/users/UserItem';

// Hooks
import useGet from '../../../query/hooks/useGet';
import useErrors from '../../../hooks/useErrors';

const Users = () => {
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
          <Tab name={'Users'} className={'list-wrapper'}>
            <List
              loading={usersLoading}
              listArr={users}
              listItem={<UserItem />}
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

export default Users;
