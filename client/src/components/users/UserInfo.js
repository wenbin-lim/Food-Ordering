import React, { useEffect, Fragment } from 'react';
import PropTypes from 'prop-types';
import { connect } from 'react-redux';
import { useParams } from 'react-router-dom';

import Moment from 'react-moment';

// Actions
import { getUser } from '../../actions/users';

// Components
import Header from '../layout/Header';

/*
  =====
  Props
  =====
  @name       auth
  @type       object
  @desc       app level auth state from RouteWrapper
  @required   true

  @name       getUser
  @type       function
  @desc       redux action to retrieve user info for database
  @required   true

  @name       users
  @type       object
  @desc       app level users state
  @required   true
*/

const UserInfo = ({
  auth: { access: authAccess },
  getUser,
  users: { user },
}) => {
  let { id } = useParams();

  useEffect(() => {
    getUser(id);
  }, [id]);

  return (
    <div
      style={{
        height: '100%',
        display: 'grid',
        gridTemplateRows: 'auto 1fr auto',
      }}
    >
      <Header title={'User Info'} closeActionCallback={'../'} />

      <div>
        {user && (
          <div style={{ padding: '1rem' }}>
            {user.name && (
              <Fragment>
                <p className='caption'>Name</p>
                <p style={{ marginBottom: '1rem' }}>{user.name}</p>
              </Fragment>
            )}

            {user.username && (
              <Fragment>
                <p className='caption'>Username</p>
                <p style={{ marginBottom: '1rem' }}>{user.username}</p>
              </Fragment>
            )}

            {authAccess === 99 && user.access && (
              <Fragment>
                <p className='caption'>Access Level</p>
                <p style={{ marginBottom: '1rem' }}>{user.access}</p>
              </Fragment>
            )}

            {user.role && (
              <Fragment>
                <p className='caption'>Role</p>
                <div
                  style={{
                    display: 'flex',
                    marginTop: '0.5rem',
                    marginBottom: '1rem',
                  }}
                >
                  {user.role.map(role => (
                    <span
                      key={`user-${user._id}-role-${role}`}
                      className='badge badge-secondary'
                      style={{
                        marginRight: '0.5rem',
                      }}
                    >
                      {role}
                    </span>
                  ))}
                </div>
              </Fragment>
            )}

            {user.username && (
              <Fragment>
                <p className='caption'>Created at</p>
                <Moment format='DD-MM-YYYY'>{user.creationDate}</Moment>
              </Fragment>
            )}

            <p></p>
          </div>
        )}
      </div>
    </div>
  );
};

UserInfo.propTypes = {
  auth: PropTypes.object.isRequired,
  getUser: PropTypes.func.isRequired,
  users: PropTypes.object.isRequired,
};

const mapStateToProps = state => ({
  users: state.users,
});

const mapDispatchToProps = { getUser };

export default connect(mapStateToProps, mapDispatchToProps)(UserInfo);
