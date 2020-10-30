import React, { useState, Fragment } from 'react';
import PropTypes from 'prop-types';
import { connect } from 'react-redux';
import { useNavigate, matchPath, useLocation } from 'react-router-dom';

// Components
import ListItem from '../layout/ListItem';
import AlertDialog from '../layout/AlertDialog';

// Icons
import AvatarIcon from '../icons/AvatarIcon';

// Actions
import { deleteUser } from '../../actions/users';

const UserItem = ({ user, deleteUser }) => {
  const { _id: userId, name, role, access } = user;

  let actions = [
    {
      name: 'View',
      path: `${userId}`,
    },
    {
      name: 'Edit',
      path: `${userId}/edit`,
    },
  ];

  const [showDeleteUserAlert, setShowDeleteUserAlert] = useState(false);

  access < 3 &&
    actions.push({
      name: 'Delete',
      callback: () => setShowDeleteUserAlert(true),
    });

  const navigate = useNavigate();
  const location = useLocation();

  const onUserDelete = async () => {
    const deleteUserSuccess = await deleteUser(userId);

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
      <ListItem
        beforeListContent={<AvatarIcon />}
        listContent={
          <Fragment>
            <p className='body-1'>{name ? name : 'No name defined'}</p>
            <div>
              {role.map((role, index) => (
                <span
                  key={`user-${userId}-role-${index}`}
                  className='badge badge-small badge-secondary mr-h'
                >
                  {role}
                </span>
              ))}
            </div>
          </Fragment>
        }
        actions={actions}
      />
      {showDeleteUserAlert && (
        <AlertDialog
          title={'Delete user?'}
          text={'Action cannot be undone'}
          action={{
            name: 'delete',
            type: 'error',
            callback: onUserDelete,
          }}
          unmountAlertDialogHandler={() => setShowDeleteUserAlert(false)}
        />
      )}
    </Fragment>
  );
};

UserItem.propTypes = {
  user: PropTypes.object.isRequired,
  deleteUser: PropTypes.func.isRequired,
};

const mapStateToProps = state => ({});

const mapDispatchToProps = {
  deleteUser,
};

export default connect(mapStateToProps, mapDispatchToProps)(UserItem);
