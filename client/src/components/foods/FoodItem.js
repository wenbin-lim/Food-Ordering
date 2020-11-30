import React, { useState, Fragment } from 'react';
import PropTypes from 'prop-types';
import { useDispatch } from 'react-redux';
import { useNavigate, matchPath, useLocation } from 'react-router-dom';

// Actions
import { setSnackbar } from '../../actions/app';

// Components
import ListItem, { Action } from '../layout/ListItem';
import AlertDialog from '../layout/AlertDialog';
import OrderDialog from '../orders/OrderDialog';

// Icons
import ImageIcon from '../icons/ImageIcon';

// Custom Hooks
import useErrors from '../../hooks/useErrors';
import useDelete from '../../query/hooks/useDelete';

const FoodItem = ({
  className,
  showOrderDialogOnClick = false,
  addToWhichBillId,
  editable = true,
  allowDelete = true,
  data,
}) => {
  const navigate = useNavigate();
  const location = useLocation();
  const dispatch = useDispatch();

  const { _id: foodId, name, image, availability } = { ...data };

  const [deleteFood, { error }] = useDelete('foods', {
    route: `/api/foods/${foodId}`,
  });
  useErrors(error);

  const [showDeleteFoodAlert, setShowDeleteFoodAlert] = useState(false);

  const [showOrderDialog, setShowOrderDialog] = useState(false);

  const onFoodDelete = async () => {
    const deleteFoodSuccess = await deleteFood();

    deleteFoodSuccess &&
      dispatch(setSnackbar(`Deleted food of name '${name}'`, 'success'));

    let match = matchPath(
      {
        path: `/:companyName/foods/${foodId}`,
        end: false,
      },
      location.pathname
    );

    return deleteFoodSuccess && match && navigate('', { replace: true });
  };

  const onClickFoodItem = () =>
    showOrderDialogOnClick && setShowOrderDialog(true);

  return (
    <Fragment>
      <ListItem className={className} onClick={onClickFoodItem}>
        <ListItem.Before>
          <div className='list-image'>
            {image ? (
              <img src={image} alt={`food-${name}-avatar`} />
            ) : (
              <ImageIcon />
            )}
          </div>
        </ListItem.Before>
        <ListItem.Content>
          <p className='body-1'>{name ? name : 'No name defined'}</p>
          {availability === false && (
            <span className='badge badge-small badge-error'>Unavailable</span>
          )}
        </ListItem.Content>
        {!showOrderDialogOnClick && editable && (
          <ListItem.Actions>
            <Action name='View' onClick={() => navigate(foodId)} />
            <Action name='Edit' onClick={() => navigate(`${foodId}/edit`)} />
            {allowDelete && (
              <Action
                name='Delete'
                onClick={() => setShowDeleteFoodAlert(true)}
              />
            )}
          </ListItem.Actions>
        )}
      </ListItem>

      {!showOrderDialogOnClick && editable && showDeleteFoodAlert && (
        <AlertDialog
          title={'Delete food?'}
          text={'Action cannot be undone'}
          action={{
            name: 'delete',
            type: 'error',
            callback: onFoodDelete,
          }}
          onCloseAlertDialog={() => setShowDeleteFoodAlert(false)}
        />
      )}

      {showOrderDialogOnClick && !editable && showOrderDialog && (
        <OrderDialog
          foodDetails={data}
          onCloseOrderDialog={() => setShowOrderDialog(false)}
          addToWhichBillId={addToWhichBillId}
        />
      )}
    </Fragment>
  );
};

FoodItem.propTypes = {
  className: PropTypes.string,
  showOrderDialogOnClick: PropTypes.bool,
  addToWhichBillId: PropTypes.string,
  editable: PropTypes.bool,
  allowDelete: PropTypes.bool,
  data: PropTypes.object,
};

export default FoodItem;
