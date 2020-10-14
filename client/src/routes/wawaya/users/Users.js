import React, { useState, Fragment } from 'react';
import PropTypes from 'prop-types';
import { connect } from 'react-redux';
import { Outlet, useNavigate } from 'react-router-dom';

import Moment from 'react-moment';
import 'moment-timezone';

// Components
import Container from '../../../components/layout/Container';
import Tabs from '../../../components/layout/Tabs';
import ListItem from '../../../components/layout/ListItem';
import Preloader from '../../../components/layout/Preloader';
import Button from '../../../components/layout/Button';
import UserItem from '../../../components/users/UserItem';

// Icons
import PlusIcon from '../../../components/icons/PlusIcon';

// Actions
import { getCompany } from '../../../actions/companies';
import { getUsers } from '../../../actions/users';
/* 
  =====
  Props
  =====
  @name       companies
  @type       object
  @desc       App level companies state
  @required   true

  @name       users
  @type       object
  @desc       App level users state
  @required   true

  @name       getUsers
  @type       function
  @desc       Redux action from users.js to populate users inside the app level state of users
  @required   true

  @name       getCompany
  @type       function
  @desc       Redux action from companies.js to set company in companies app level state
  @required   true
*/
const Users = ({
  companies: { company, companies, companiesLoading },
  users: { users, usersLoading },
  getUsers,
  getCompany,
}) => {
  const navigate = useNavigate();

  const [currentTabIndex, setCurrentTabIndex] = useState(0);
  const onClickCompanyListItem = async companyId => {
    // set back to 0 so that can navigate to next tab
    setCurrentTabIndex(0);

    await getCompany(companyId);
    const getUsersSuccess = await getUsers(companyId);

    if (getUsersSuccess) {
      setCurrentTabIndex(1);
    }
  };

  const companyList = companiesLoading ? (
    <Preloader height={24} />
  ) : companies && companies.length > 0 ? (
    <Fragment>
      {companies.map((company, index) => (
        <ListItem
          key={company._id}
          beforeListContent={<h2 className='heading-2'>{index + 1}</h2>}
          listContent={
            <Fragment>
              {company.displayedName && (
                <p className='body-1'>{company.displayedName}</p>
              )}
              {company.creationDate && (
                <p className='body-2'>
                  Created at{' '}
                  <Moment local format='DD/MM HH:mm:ss'>
                    {company.creationDate}
                  </Moment>
                </p>
              )}
            </Fragment>
          }
          onClickListItem={() => onClickCompanyListItem(company._id)}
        />
      ))}
    </Fragment>
  ) : (
    <p className='caption text-center'>No companies found</p>
  );

  const usersList = (
    <Fragment>
      {company && (
        <div
          style={{
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'space-between',
            marginBottom: '1rem',
          }}
        >
          <h2 className='heading-2'>{company.displayedName}</h2>
          <Button
            btnStyle={'contained'}
            type={'primary'}
            text={'user'}
            icon={<PlusIcon />}
            leadingIcon={true}
            onClick={() => navigate('add')}
          />
        </div>
      )}
      {usersLoading ? (
        <Preloader height={24} />
      ) : users && users.length > 0 ? (
        <Fragment>
          {users.map(user => (
            <UserItem key={user._id} user={user} />
          ))}
        </Fragment>
      ) : company ? (
        <p className='caption text-center'>No users found</p>
      ) : (
        <p className='caption text-center'>Please select a company first</p>
      )}
    </Fragment>
  );

  const tabs = [
    {
      name: 'Companies',
      content: companyList,
      style: {
        paddingBottom: '2rem',
      },
    },
    {
      name: 'Users',
      content: usersList,
      style: {
        paddingBottom: '2rem',
      },
    },
  ];

  return (
    <Container
      parentContent={
        <Tabs
          tabs={tabs}
          currentTabIndex={currentTabIndex}
          tabContentsWillSlide={false}
        />
      }
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
