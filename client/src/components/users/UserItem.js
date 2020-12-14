import React, { useState, Fragment } from 'react';
import PropTypes from 'prop-types';
import { useDispatch } from 'react-redux';
import { useNavigate, matchPath, useLocation } from 'react-router-dom';

// Actions
import { setSnackbar } from '../../actions/app';

// Components
import ListItem, { Action } from '../layout/ListItem';
import AlertDialog from '../layout/AlertDialog';

// Icons
import AvatarIcon from '../icons/AvatarIcon';

// Custom Hooks
import useErrors from '../../hooks/useErrors';
import useDelete from '../../query/hooks/useDelete';

const UserItem = ({ data, canDeleteAdmin }) => {
  const navigate = useNavigate();
  const location = useLocation();
  const dispatch = useDispatch();

  const { _id: userId, name, role, access } = { ...data };

  const [deleteUser, { error }] = useDelete('users', {
    route: `/api/users/${userId}`,
  });
  useErrors(error);

  const [showDeleteUserAlert, setShowDeleteUserAlert] = useState(false);

  const onUserDelete = async () => {
    const deleteUserSuccess = await deleteUser();

    deleteUserSuccess &&
      dispatch(setSnackbar(`Deleted user of name '${name}'`, 'success'));

    let match = matchPath(
      {
        path: `/:companyName/users/${userId}`,
        end: false,
      },
      location.pathname
    );

    return deleteUserSuccess && match && navigate('', { replace: true });
  };

  return (
    <Fragment>
      <ListItem>
        <ListItem.Before>
          <AvatarIcon />
        </ListItem.Before>
        <ListItem.Content>
          <p className='body-1'>{name ? name : 'No name defined'}</p>
          {Array.isArray(role) &&
            role.map((role, index) => (
              <span
                key={`user-${userId}-role-${index}`}
                className='badge badge-small badge-secondary mr-h'
              >
                {role}
              </span>
            ))}
        </ListItem.Content>
        <ListItem.Actions>
          <Action name='View' onClick={() => navigate(userId)} />
          <Action name='Edit' onClick={() => navigate(`${userId}/edit`)} />
          {(canDeleteAdmin || access < 3) && (
            <Action
              name='Delete'
              onClick={() => setShowDeleteUserAlert(true)}
            />
          )}
        </ListItem.Actions>
      </ListItem>
      {showDeleteUserAlert && (
        <AlertDialog
          title={'Delete user?'}
          text={'Action cannot be undone'}
          action={{
            name: 'delete',
            type: 'error',
            callback: onUserDelete,
          }}
          onCloseAlertDialog={() => setShowDeleteUserAlert(false)}
        />
      )}
    </Fragment>
  );
};

UserItem.propTypes = {
  data: PropTypes.object,
  canDeleteAdmin: PropTypes.bool,
};

export default UserItem;
