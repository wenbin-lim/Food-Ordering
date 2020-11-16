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
import ImageIcon from '../icons/ImageIcon';

// Custom Hooks
import useErrors from '../../hooks/useErrors';
import useDeleteOne from '../../query/hooks/useDeleteOne';

const FoodItem = ({ className, editable = true, data }) => {
  const navigate = useNavigate();
  const location = useLocation();
  const dispatch = useDispatch();

  const [deleteFood, { error }] = useDeleteOne('foods');
  useErrors(error);

  const { _id: foodId, name, image, availability } = { ...data };

  const [showDeleteFoodAlert, setShowDeleteFoodAlert] = useState(false);

  const onFoodDelete = async () => {
    const deleteFoodSuccess = await deleteFood(foodId);

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

  return (
    <Fragment>
      <ListItem className={className}>
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
        {editable && (
          <ListItem.Actions>
            <Action name='View' onClick={() => navigate(foodId)} />
            <Action name='Edit' onClick={() => navigate(`${foodId}/edit`)} />
            <Action
              name='Delete'
              onClick={() => setShowDeleteFoodAlert(true)}
            />
          </ListItem.Actions>
        )}
      </ListItem>

      {editable && showDeleteFoodAlert && (
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
    </Fragment>
  );
};

FoodItem.propTypes = {
  className: PropTypes.string,
  editable: PropTypes.bool,
  data: PropTypes.object,
};

export default FoodItem;
