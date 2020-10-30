import React, { useState, Fragment } from 'react';
import PropTypes from 'prop-types';
import { connect } from 'react-redux';
import { useNavigate, matchPath, useLocation } from 'react-router-dom';

// Components
import ListItem from '../layout/ListItem';
import AlertDialog from '../layout/AlertDialog';

// Icons
import ImageIcon from '../icons/ImageIcon';

// Actions
import { deleteFood } from '../../actions/foods';

const FoodItem = ({
  classes,
  editable = true,
  color = 'surface1',
  food,
  deleteFood,
}) => {
  const { _id: foodId, name, image, availability } = food;

  let actions = [
    {
      name: 'View',
      path: `${foodId}`,
    },
    {
      name: 'Edit',
      path: `${foodId}/edit`,
    },
    {
      name: 'Delete',
      callback: () => setShowDeleteFoodAlert(true),
    },
  ];

  const [showDeleteFoodAlert, setShowDeleteFoodAlert] = useState(false);

  const navigate = useNavigate();
  const location = useLocation();

  const onFoodDelete = async () => {
    const deleteFoodSuccess = await deleteFood(foodId);

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
      <ListItem
        classes={classes}
        color={color}
        beforeListContent={
          <div className='list-image'>
            {image ? (
              <img src={image} alt={`food-${name}-avatar`} />
            ) : (
              <ImageIcon />
            )}
          </div>
        }
        listContent={
          <Fragment>
            <p className='body-1'>{name ? name : 'No name defined'}</p>
            {availability === false && (
              <span className='badge badge-error'>Unavailable</span>
            )}
          </Fragment>
        }
        actions={editable ? actions : null}
      />
      {editable && showDeleteFoodAlert && (
        <AlertDialog
          title={'Delete food?'}
          text={'Action cannot be undone'}
          action={{
            name: 'delete',
            type: 'error',
            callback: onFoodDelete,
          }}
          unmountAlertDialogHandler={() => setShowDeleteFoodAlert(false)}
        />
      )}
    </Fragment>
  );
};

FoodItem.propTypes = {
  classes: PropTypes.string,
  editable: PropTypes.bool,
  color: PropTypes.oneOf([
    'surface1',
    'surface2',
    'surface3',
    'primary',
    'secondary',
    'error',
    'success',
    'warning',
    'background',
  ]),
  food: PropTypes.object.isRequired,
  deleteFood: PropTypes.func.isRequired,
};

const mapStateToProps = state => ({});

const mapDispatchToProps = {
  deleteFood,
};

export default connect(mapStateToProps, mapDispatchToProps)(FoodItem);
