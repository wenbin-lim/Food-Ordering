import React, { useEffect, Fragment } from 'react';
import PropTypes from 'prop-types';
import { connect } from 'react-redux';
import { Outlet } from 'react-router-dom';

// Layout Components
import Preloader from '../layout/Preloader';

// Components
import Container from '../layout/Container';
import UserItem from './UserItem';

// Actions
import { getUsers } from '../../actions/users';

/* 
  =====
  Props
  =====
  @name       users
  @type       object
  @desc       App level users state
  @required   true

  @name       getUsers
  @type       function
  @desc       Redux action from users.js to populate users inside the app level state of users
  @required   true
*/
const Users = ({ users: { users, userListLoading }, getUsers }) => {
  useEffect(() => {
    getUsers();
    // eslint-disable-next-line
  }, []);

  return (
    <Container
      parentContent={
        <Fragment>
          <h1 className='heading-1'>Users</h1>
          {userListLoading ? (
            <Preloader height={24} />
          ) : users && users.length > 0 ? (
            users.map(user => <UserItem key={user._id} user={user} />)
          ) : (
            <p className='caption text-center'>No users found</p>
          )}
        </Fragment>
      }
      childContent={<Outlet />}
      parentSize={3}
      childSize={2}
    />
  );
};

Users.propTypes = {
  users: PropTypes.object.isRequired,
  getUsers: PropTypes.func.isRequired,
};

const mapStateToProps = state => ({
  users: state.users,
});

const mapDispatchToProps = { getUsers };

export default connect(mapStateToProps, mapDispatchToProps)(Users);
