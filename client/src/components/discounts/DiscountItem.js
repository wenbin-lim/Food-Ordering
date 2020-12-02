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

const DiscountItem = ({ index, data }) => {
  const navigate = useNavigate();
  const location = useLocation();
  const dispatch = useDispatch();

  const { _id: discountId, code, expiry } = { ...data };

  const [deleteDiscount, { error }] = useDelete('discounts', {
    route: `/api/discounts/${discountId}`,
  });
  useErrors(error);

  const [showDeleteDiscountAlert, setShowDeleteDiscountAlert] = useState(false);

  const onDiscountDelete = async () => {
    const deleteDiscountSuccess = await deleteDiscount();

    deleteDiscountSuccess &&
      dispatch(setSnackbar(`Deleted discount of code '${code}'`, 'success'));

    let match = matchPath(
      {
        path: `/:companyName/discounts/${discountId}`,
        end: false,
      },
      location.pathname
    );

    return deleteDiscountSuccess && match && navigate('', { replace: true });
  };

  return (
    <Fragment>
      <ListItem>
        <ListItem.Before>
          <h2 className='list-index'>{index}</h2>
        </ListItem.Before>
        <ListItem.Content>
          <p className='body-1'>{code ? code : 'No code defined'}</p>
          {new Date(expiry).getTime() < new Date().getTime() ? (
            <span className='badge badge-error badge-small'>Expired</span>
          ) : (
            <p className='body-2'>
              Expires at{' '}
              <Moment local format='DD/MM/YY'>
                {expiry}
              </Moment>
            </p>
          )}
        </ListItem.Content>
        <ListItem.Actions>
          <Action name='View' onClick={() => navigate(discountId)} />
          <Action name='Edit' onClick={() => navigate(`${discountId}/edit`)} />
          <Action
            name='Delete'
            onClick={() => setShowDeleteDiscountAlert(true)}
          />
        </ListItem.Actions>
      </ListItem>

      {showDeleteDiscountAlert && (
        <AlertDialog
          title={'Delete discount?'}
          text={'Action cannot be undone'}
          action={{
            name: 'delete',
            type: 'error',
            callback: onDiscountDelete,
          }}
          onCloseAlertDialog={() => setShowDeleteDiscountAlert(false)}
        />
      )}
    </Fragment>
  );
};

DiscountItem.propTypes = {
  index: PropTypes.number,
  data: PropTypes.object,
};

export default DiscountItem;
