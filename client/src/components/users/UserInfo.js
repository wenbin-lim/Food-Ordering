import React, { useEffect } from 'react';
import PropTypes from 'prop-types';
import { connect } from 'react-redux';
import { useParams } from 'react-router-dom';

import Moment from 'react-moment';

// Actions
import { getUser } from '../../actions/users';

// Components
import Header from '../layout/Header';
import Spinner from '../layout/Spinner';

/* 
  =====
  Props
  =====
  @name       getUser 
  @type       function
  @desc       redux action to retrieve user info for database
  @required   true

  @name       users 
  @type       object
  @desc       app level users state
  @required   true
*/

const UserInfo = ({ getUser, users: { user, userLoading } }) => {
  let { id } = useParams();

  useEffect(() => {
    getUser(id);
    // eslint-disable-next-line
  }, [id]);

  return (
    <div
      style={{
        height: '100%',
        display: 'grid',
        gridTemplateRows: 'auto 1fr auto',
      }}
    >
      <Header title={'User Info'} closeActionCallback={'/users'} />

      <div>
        {!userLoading && user ? (
          <div style={{ padding: '2rem' }}>
            <p className='caption'>Name</p>
            <p style={{ marginBottom: '1rem' }}>{user.name}</p>
            <p className='caption'>Username</p>
            <p style={{ marginBottom: '1rem' }}>{user.username}</p>
            <p className='caption'>Created at</p>
            <p>
              <Moment format='DD-MM-YYYY'>{user.creationDate}</Moment>
            </p>
          </div>
        ) : (
          <Spinner height={'2rem'} />
        )}
      </div>
    </div>
  );
};

UserInfo.propTypes = {
  getUser: PropTypes.func.isRequired,
  users: PropTypes.object.isRequired,
};

const mapStateToProps = state => ({
  users: state.users,
});

const mapDispatchToProps = { getUser };

export default connect(mapStateToProps, mapDispatchToProps)(UserInfo);
