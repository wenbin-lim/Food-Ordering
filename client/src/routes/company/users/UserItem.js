import React, { useState, Fragment } from 'react';
import PropTypes from 'prop-types';
import { connect } from 'react-redux';

import Moment from 'react-moment';
import 'moment-timezone';

// Components
import ListItem from '../layout/ListItem';
import Dialog from '../layout/Dialog';
import Button from '../layout/Button';

// Icons
import AvatarIcon from '../icons/AvatarIcon';

// Actions
import { deleteUser } from '../../actions/users';

/* 
  =====
  Props
  =====
  @name       authenticatedUser
  @type       object
  @desc       currently logged in user
  @required   true

  @name       user
  @type       object
  @desc       user object from Parent
  @required   true

  @name       deleteUser
  @type       function
  @desc       Redux action from users to delete user from app level users state and DB
  @required   true
*/
const UserItem = ({ authenticatedUser, user, deleteUser }) => {
  // destructure user obj
  const { _id: userId, name, creationDate } = user;

  // Populate list item actions
  let listItemAction = [
    {
      name: 'View',
      link: `${userId}`,
    },
    {
      name: 'Edit',
      link: `${userId}/edit`,
    },
  ];

  const [showDeleteUserAlert, setShowDeleteUserAlert] = useState(false);

  if (authenticatedUser._id !== userId) {
    listItemAction.push({
      name: 'Delete',
      callback: () => setShowDeleteUserAlert(true),
    });
  } else {
    listItemAction.filter(action => action.name === 'Delete');
  }

  return (
    <Fragment>
      <ListItem
        beforeListContent={<AvatarIcon />}
        listContent={
          <Fragment>
            <p className='body-1'>{name.toUpperCase()}</p>
            <p className='body-2'>
              Created at{' '}
              <Moment local format='DD/MM HH:mm:ss'>
                {creationDate}
              </Moment>
            </p>
          </Fragment>
        }
        actions={listItemAction}
      />
      {showDeleteUserAlert && (
        <Dialog
          content={
            <h2 className='heading-2 text-center' style={{ padding: '3rem 0' }}>
              Delete user?
            </h2>
          }
          footer={
            <div
              style={{
                display: 'flex',
                justifyContent: 'space-evenly',
              }}
            >
              <Button
                style={'contained'}
                type={'error'}
                text={'delete'}
                additionalStyles={{ flex: '1', marginRight: '1rem' }}
                onClick={() => deleteUser(userId)}
              />
              <Button
                style={'outline'}
                color={'var(--on-background)'}
                text={'Cancel'}
                additionalStyles={{ flex: '1', marginLeft: '1rem' }}
                onClick={() => setShowDeleteUserAlert(false)}
              />
            </div>
          }
          closeDialogHandler={() => setShowDeleteUserAlert(false)}
        />
      )}
    </Fragment>
  );
};

UserItem.propTypes = {
  authenticatedUser: PropTypes.object,
  user: PropTypes.object.isRequired,
  deleteUser: PropTypes.func.isRequired,
};

const mapStateToProps = state => ({
  authenticatedUser: state.auth.user,
});

const mapDispatchToProps = {
  deleteUser,
};

export default connect(mapStateToProps, mapDispatchToProps)(UserItem);
