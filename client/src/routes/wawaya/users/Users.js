import React, { useState, useRef, Fragment } from 'react';
import PropTypes from 'prop-types';
import { connect } from 'react-redux';
import { Outlet, useNavigate } from 'react-router-dom';

// Components
import Container from '../../../components/layout/Container';
import Tabs from '../../../components/layout/Tabs';
import ListPreloader from '../../../components/preloaders/ListPreloader';
import Button from '../../../components/layout/Button';
import CompanyItem from '../companies/CompanyItem';
import UserItem from '../../../components/users/UserItem';
import SearchInput from '../../../components/layout/SearchInput';

// Icons
import PlusIcon from '../../../components/icons/PlusIcon';

// Actions
import { getCompany } from '../../../actions/companies';
import { getUsers } from '../../../actions/users';

const Users = ({
  companies: { companiesLoading, companies, requesting, company },
  users: { usersLoading, users },
  getUsers,
  getCompany,
}) => {
  const onClickCompanyItem = companyId => {
    tabsRef.current.changeTab(1);
    getCompany(companyId);
    getUsers(companyId);
  };

  const [filteredCompanies, setFilteredCompanies] = useState([]);
  const onSearchCompanies = filteredResult =>
    setFilteredCompanies(filteredResult);

  const [filteredUsers, setFilteredUsers] = useState([]);
  const onSearchUsers = filteredResult => setFilteredUsers(filteredResult);

  const companyList =
    companiesLoading || !Array.isArray(companies) ? (
      <ListPreloader />
    ) : companies.length > 0 ? (
      <article className='list'>
        <header className='list-header'>
          <div className='list-header-right-content'>
            <SearchInput
              name='search'
              queryFields={['name']}
              array={companies}
              onSearch={onSearchCompanies}
            />
          </div>
        </header>
        {filteredCompanies.map((company, index) => (
          <CompanyItem
            key={company._id}
            index={index + 1}
            company={company}
            onClick={() => onClickCompanyItem(company._id)}
          />
        ))}
      </article>
    ) : (
      <p className='caption text-center'>No companies found</p>
    );

  const navigate = useNavigate();

  const usersList = company ? (
    <Fragment>
      <Button
        classes={'list-add-btn'}
        fill={'contained'}
        type={'primary'}
        icon={<PlusIcon />}
        onClick={() => navigate('add')}
      />
      <article className='list'>
        {usersLoading || !Array.isArray(users) ? (
          <ListPreloader />
        ) : users.length > 0 ? (
          <Fragment>
            <header className='list-header'>
              <h3 className='list-header-left-content heading-3'>
                {!requesting && company.displayedName}
              </h3>
              <div className='list-header-right-content'>
                <SearchInput
                  name='search'
                  queryFields={['name']}
                  array={users}
                  onSearch={onSearchUsers}
                />
              </div>
            </header>
            {filteredUsers.map(user => (
              <UserItem key={user._id} user={user} />
            ))}
          </Fragment>
        ) : (
          <p className='caption text-center'>No users found</p>
        )}
      </article>
    </Fragment>
  ) : (
    <p className='caption text-center'>Please select a company first</p>
  );

  const tabsRef = useRef(null);

  const tabs = [
    {
      name: 'Companies',
      content: companyList,
      class: 'list-wrapper',
    },
    {
      name: 'Users',
      content: usersList,
      class: 'list-wrapper',
    },
  ];

  return (
    <Container
      parentClass={'tabs-wrapper'}
      parentContent={<Tabs wrapper={false} ref={tabsRef} tabs={tabs} />}
      childClass={'sidesheet'}
      childContent={<Outlet />}
      parentSize={1}
      childSize={1}
    />
  );
};

Users.propTypes = {
  companies: PropTypes.object.isRequired,
  users: PropTypes.object.isRequired,
  getUsers: PropTypes.func.isRequired,
  getCompany: PropTypes.func.isRequired,
};

const mapStateToProps = state => ({
  companies: state.companies,
  users: state.users,
});

const mapDispatchToProps = {
  getUsers,
  getCompany,
};

export default connect(mapStateToProps, mapDispatchToProps)(Users);
