import React, { useState, Fragment } from 'react';
import PropTypes from 'prop-types';
import { useDispatch } from 'react-redux';
import { useNavigate, matchPath, useLocation } from 'react-router-dom';

// Actions
import { setSnackbar } from '../../actions/app';

// Components
import ListItem, { Action } from '../layout/ListItem';
import AlertDialog from '../layout/AlertDialog';

// Hooks
import usePut from '../../query/hooks/usePut';
import useErrors from '../../hooks/useErrors';

const WaiterItem = ({ table }) => {
  const navigate = useNavigate();
  const location = useLocation();
  const dispatch = useDispatch();

  const { _id: tableId, name, bill } = table;

  const [releaseTablw, { error }] = usePut('tables', {
    route: `/api/tables/${tableId}/release`,
  });
  useErrors(error);

  const [showReleaseTableAlert, setShowReleaseTableAlert] = useState(false);

  const onReleaseTable = async () => {
    const releaseTableSuccess = await releaseTablw();

    releaseTableSuccess && dispatch(setSnackbar(`Table released!`, 'success'));

    let match = matchPath(
      {
        path: `/:companyName/waiter/${bill?._id}`,
        end: false,
      },
      location.pathname
    );

    return releaseTableSuccess && match && navigate('', { replace: true });
  };

  const getStatusColor = bill => {
    if (bill) {
      const { status } = bill;
      switch (status) {
        case 'occupied':
          return 'warning';
        case 'ready':
          return 'success';
        default:
          return '';
      }
    } else {
      // empty table
      return 'surface2';
    }
  };

  return (
    <Fragment>
      <ListItem className='waiteritem'>
        <ListItem.Before>
          <div className={`waiteritem-status-${getStatusColor(bill)}`} />
        </ListItem.Before>
        <ListItem.Content className='waiteritem-content'>
          <p className='waiteritem-table-name'>Table {name}</p>
          {bill?.status === 'ready' && <p className='body-2'>Ready for bill</p>}
          {bill?.status === 'occupied' && <p className='body-2'>Occupied</p>}
          {!bill && <p className='body-2'>Empty</p>}
        </ListItem.Content>
        {bill && (
          <ListItem.Actions>
            <Action
              name='Release'
              onClick={() => setShowReleaseTableAlert(true)}
            />
            <Action name='View' onClick={() => navigate(bill._id)} />
          </ListItem.Actions>
        )}
      </ListItem>
      {showReleaseTableAlert && (
        <AlertDialog
          title='Release Table?'
          text='Action cannot be undone'
          action={{
            name: 'Release',
            type: 'error',
            callback: onReleaseTable,
          }}
          onCloseAlertDialog={() => setShowReleaseTableAlert(false)}
        />
      )}
    </Fragment>
  );
};

WaiterItem.propTypes = {
  table: PropTypes.object,
};

export default WaiterItem;
