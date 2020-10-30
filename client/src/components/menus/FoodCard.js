import React, { useState, Fragment } from 'react';
import PropTypes from 'prop-types';
import { connect } from 'react-redux';

// Components
import FoodDialog from './FoodDialog';

const FoodCard = ({ food, screenOrientation }) => {
  const { _id: foodId, name, price, promotionPrice, image } = food;

  const [showFoodDialog, setshowFoodDialog] = useState(false);

  return (
    <Fragment>
      <div className='foodcard' onClick={() => setshowFoodDialog(true)}>
        <div className='foodcard-image'>
          <img src={image} alt={`${name}-foodimage-${foodId}`} />
        </div>
        <div className='foodcard-content'>
          <p className='foodcard-name'>{name}</p>
          <div className='foodcard-price'>
            {typeof promotionPrice === 'number' && typeof price === 'number' ? (
              <Fragment>
                <p className='original-price'>&nbsp;{price}&nbsp;</p>
                <p className='current-price'>${promotionPrice.toFixed(2)}</p>
              </Fragment>
            ) : (
              typeof price === 'number' && (
                <p className='current-price'>${price.toFixed(2)}</p>
              )
            )}
          </div>
        </div>
      </div>
      {showFoodDialog && (
        <FoodDialog
          food={food}
          fullscreen={screenOrientation}
          closeFoodDialogHandler={() => setshowFoodDialog(false)}
        />
      )}
    </Fragment>
  );
};

FoodCard.propTypes = {
  food: PropTypes.object.isRequired,
};

const mapStateToProps = state => ({
  screenOrientation: state.app.screenOrientation,
});

const mapDispatchToProps = {};

export default connect(mapStateToProps, mapDispatchToProps)(FoodCard);
