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
import useDeleteOne from '../../query/hooks/useDeleteOne';

const TableItem = ({ index, data }) => {
  const navigate = useNavigate();
  const location = useLocation();
  const dispatch = useDispatch();

  const [deleteTable, { error }] = useDeleteOne('tables');
  useErrors(error);

  const { _id: tableId, name } = { ...data };

  const [showDeleteTableAlert, setShowDeleteTableAlert] = useState(false);

  const onTableDelete = async () => {
    const deleteTableSuccess = await deleteTable(tableId);

    deleteTableSuccess &&
      dispatch(setSnackbar(`Deleted table of name '${name}'`, 'success'));

    let match = matchPath(
      {
        path: `/:companyName/tables/${tableId}`,
        end: false,
      },
      location.pathname
    );

    return deleteTableSuccess && match && navigate('', { replace: true });
  };

  return (
    <Fragment>
      <ListItem>
        <ListItem.Before>
          <h2 className='list-index'>{index}</h2>
        </ListItem.Before>
        <ListItem.Content>
          <p className='body-1'>{name ? name : 'No name defined'}</p>
        </ListItem.Content>
        <ListItem.Actions>
          <Action name='View' onClick={() => navigate(tableId)} />
          <Action name='Edit' onClick={() => navigate(`${tableId}/edit`)} />
          <Action name='Delete' onClick={() => setShowDeleteTableAlert(true)} />
        </ListItem.Actions>
      </ListItem>

      {showDeleteTableAlert && (
        <AlertDialog
          title={'Delete table?'}
          text={'Action cannot be undone'}
          action={{
            name: 'delete',
            type: 'error',
            callback: onTableDelete,
          }}
          onCloseAlertDialog={() => setShowDeleteTableAlert(false)}
        />
      )}
    </Fragment>
  );
};

TableItem.propTypes = {
  index: PropTypes.number,
  data: PropTypes.object,
};

export default TableItem;
