import React, { useEffect, Fragment } from 'react';
import PropTypes from 'prop-types';
import { connect } from 'react-redux';
import { useParams, useNavigate } from 'react-router-dom';

import Moment from 'react-moment';

// Actions
import { getUser } from '../../actions/users';

// Components
import SideSheet from '../layout/SideSheet';
import Spinner from '../layout/Spinner';

const UserInfo = ({ userAccess, users: { requesting, user }, getUser }) => {
  let { id } = useParams();
  const navigate = useNavigate();

  useEffect(() => {
    getUser(id);

    // eslint-disable-next-line
  }, [id]);

  const { _id: userId, username, name, access, role, creationDate } = {
    ...user,
  };

  const closeSideSheet = () => navigate('../');

  const sideSheetContent =
    requesting || userId !== id ? (
      <Spinner />
    ) : (
      <Fragment>
        {username && (
          <div className='row'>
            <div className='col'>
              <p className='caption'>Username</p>
              <p className='body-1'>{username}</p>
            </div>
          </div>
        )}

        {userAccess === 99 && access && (
          <div className='row'>
            <div className='col'>
              <p className='caption'>Access</p>
              <p className='body-1'>{access}</p>
            </div>
          </div>
        )}

        {Array.isArray(role) && (
          <div className='row'>
            <div className='col'>
              <p className='caption'>Role(s)</p>
              <div>
                {role.length > 0
                  ? role.map(el => (
                      <span
                        key={`user-${user._id}-role-${el}`}
                        className='badge badge-secondary mr-h'
                      >
                        {el}
                      </span>
                    ))
                  : 'No roles defined'}
              </div>
            </div>
          </div>
        )}

        {creationDate && (
          <div className='row'>
            <div className='col'>
              <p className='caption'>Created at</p>
              <Moment format='DD-MM-YYYY'>{creationDate}</Moment>
            </div>
          </div>
        )}
      </Fragment>
    );

  return (
    <SideSheet
      wrapper={false}
      headerTitle={!requesting || userId === id ? name : null}
      closeSideSheetHandler={closeSideSheet}
      content={sideSheetContent}
    />
  );
};

UserInfo.propTypes = {
  userAccess: PropTypes.number.isRequired,
  getUser: PropTypes.func.isRequired,
  users: PropTypes.object.isRequired,
};

const mapStateToProps = state => ({
  users: state.users,
});

const mapDispatchToProps = { getUser };

export default connect(mapStateToProps, mapDispatchToProps)(UserInfo);
