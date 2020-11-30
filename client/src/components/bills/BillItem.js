import React, { useState, Fragment } from 'react';
import PropTypes from 'prop-types';
import { useDispatch } from 'react-redux';
import { useNavigate, matchPath, useLocation } from 'react-router-dom';

import Moment from 'react-moment';

// Actions
import { setSnackbar } from '../../actions/app';

// Components
import ListItem, { Action } from '../layout/ListItem';
import AlertDialog from '../layout/AlertDialog';

// Custom Hooks
import useErrors from '../../hooks/useErrors';
import useDelete from '../../query/hooks/useDelete';

const BillItem = ({ index, data }) => {
  const navigate = useNavigate();
  const location = useLocation();
  const dispatch = useDispatch();

  const { _id: billId, invoiceNo, status, total } = { ...data };

  const [deleteBill, { error }] = useDelete('bills', {
    route: `/api/bills/${billId}`,
  });
  useErrors(error);

  const [showDeleteBillAlert, setShowDeleteBillAlert] = useState(false);

  const onBillDelete = async () => {
    const deleteBillSuccess = await deleteBill();

    deleteBillSuccess && dispatch(setSnackbar(`Bill deleted!`, 'success'));

    let match = matchPath(
      {
        path: `/:companyName/bills/${billId}`,
        end: false,
      },
      location.pathname
    );

    return deleteBillSuccess && match && navigate('', { replace: true });
  };

  return (
    <Fragment>
      <ListItem>
        <ListItem.Before>
          <h2 className='list-index'>{index}</h2>
        </ListItem.Before>
        <ListItem.Content>
          <p className='body-1 text-bold'>{invoiceNo}</p>
          {status === 'settled' ? (
            <span className='badge badge-success'>Settled</span>
          ) : (
            <span className='badge badge-error'>Ongoing</span>
          )}
        </ListItem.Content>
        {status === 'settled' && (
          <ListItem.After>
            <p className='body-1 text-bold'>${total.toFixed(2)}</p>
          </ListItem.After>
        )}
        <ListItem.Actions>
          <Action name='View' onClick={() => navigate(billId)} />
          <Action name='Edit' onClick={() => navigate(`${billId}/edit`)} />
          {status === 'settled' && (
            <Action
              name='Delete'
              onClick={() => setShowDeleteBillAlert(true)}
            />
          )}
        </ListItem.Actions>
      </ListItem>

      {showDeleteBillAlert && (
        <AlertDialog
          title={'Delete bill?'}
          text={'Action cannot be undone'}
          action={{
            name: 'delete',
            type: 'error',
            callback: onBillDelete,
          }}
          onCloseAlertDialog={() => setShowDeleteBillAlert(false)}
        />
      )}
    </Fragment>
  );
};

BillItem.propTypes = {
  index: PropTypes.number,
  data: PropTypes.object,
};

export default BillItem;
