import React, { useState, Fragment } from 'react';
import PropTypes from 'prop-types';
import { useDispatch } from 'react-redux';
import { useNavigate, matchPath, useLocation } from 'react-router-dom';

// Actions
import { setSnackbar } from '../../actions/app';

// Components
import ListItem, { Action } from '../layout/ListItem';
import AlertDialog from '../layout/AlertDialog';

// Custom Hooks
import useErrors from '../../hooks/useErrors';
import useDelete from '../../query/hooks/useDelete';

const MenuItem = ({ data }) => {
  const navigate = useNavigate();
  const location = useLocation();
  const dispatch = useDispatch();

  const { _id: menuId, name, index, availability } = { ...data };

  const [deleteMenu, { error }] = useDelete('menus', {
    route: `/api/menus/${menuId}`,
  });
  useErrors(error);

  const [showDeleteMenuAlert, setShowDeleteMenuAlert] = useState(false);

  const onMenuDelete = async () => {
    const deleteMenuSuccess = await deleteMenu();

    deleteMenuSuccess &&
      dispatch(setSnackbar(`Deleted menu of name '${name}'`, 'success'));

    let match = matchPath(
      {
        path: `/:companyName/menus/${menuId}`,
        end: false,
      },
      location.pathname
    );

    return deleteMenuSuccess && match && navigate('', { replace: true });
  };

  return (
    <Fragment>
      <ListItem>
        <ListItem.Before>
          <h2 className='list-index'>{index}</h2>
        </ListItem.Before>
        <ListItem.Content>
          <p className='body-1'>{name ? name : 'No name defined'}</p>
          {availability === false && (
            <span className='badge badge-small badge-error'>Unavailable</span>
          )}
        </ListItem.Content>
        <ListItem.Actions>
          <Action name='View' onClick={() => navigate(menuId)} />
          <Action name='Edit' onClick={() => navigate(`${menuId}/edit`)} />
          <Action name='Delete' onClick={() => setShowDeleteMenuAlert(true)} />
        </ListItem.Actions>
      </ListItem>

      {showDeleteMenuAlert && (
        <AlertDialog
          title={'Delete menu?'}
          text={'Action cannot be undone'}
          action={{
            name: 'delete',
            type: 'error',
            callback: onMenuDelete,
          }}
          onCloseAlertDialog={() => setShowDeleteMenuAlert(false)}
        />
      )}
    </Fragment>
  );
};

MenuItem.propTypes = {
  data: PropTypes.object,
};

export default MenuItem;
