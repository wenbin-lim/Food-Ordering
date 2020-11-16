import React from 'react';
import PropTypes from 'prop-types';
import { useParams, useNavigate } from 'react-router-dom';

// Components
import SideSheet from '../layout/SideSheet';
import Spinner from '../layout/Spinner';

// Hooks
import useGetOne from '../../query/hooks/useGetOne';
import useErrors from '../../hooks/useErrors';

const User = ({ user: { access: userAccess } }) => {
  let { id } = useParams();
  const navigate = useNavigate();
  const { data: user, isLoading, error } = useGetOne('user', id);
  useErrors(error);

  const { _id: userId, username, name, access, role } = {
    ...user,
  };

  return (
    <SideSheet wrapper={false}>
      <SideSheet.Header title={name} closeHandler={() => navigate('../')} />
      {isLoading || error ? (
        <Spinner />
      ) : (
        <SideSheet.Content>
          {username && (
            <div className='row'>
              <div className='col'>
                <p className='caption'>Username</p>
                <p className='body-1'>{name}</p>
              </div>
            </div>
          )}

          {userAccess === 99 && typeof access === 'number' && (
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
                <p className='caption mb-h'>Role(s)</p>
                {role.length > 0
                  ? role.map(el => (
                      <span
                        key={`user-${userId}-role-${el}`}
                        className='badge badge-secondary mr-h'
                      >
                        {el}
                      </span>
                    ))
                  : 'No roles defined'}
              </div>
            </div>
          )}
        </SideSheet.Content>
      )}
    </SideSheet>
  );
};

User.propTypes = {
  user: PropTypes.object,
};

export default User;
