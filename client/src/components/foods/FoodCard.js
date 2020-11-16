import React, { useState, Fragment } from 'react';
import PropTypes from 'prop-types';
import { connect } from 'react-redux';

// Components
import OrderDialog from '../orders/OrderDialog';

// Icons
import ImageIcon from '../icons/ImageIcon';

const FoodCard = ({ food }) => {
  const { name, price, promotionPrice, image } = food;

  const [showOrderDialog, setshowOrderDialog] = useState(false);

  return (
    <Fragment>
      <div className='foodcard' onClick={() => setshowOrderDialog(true)}>
        <div className='foodcard-image'>
          {image ? (
            <img src={image} alt={`${name}-foodimage`} />
          ) : (
            <ImageIcon width={64} />
          )}
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
      {showOrderDialog && (
        <OrderDialog
          foodDetails={food}
          onCloseOrderDialog={() => setshowOrderDialog(false)}
        />
      )}
    </Fragment>
  );
};

FoodCard.propTypes = {
  food: PropTypes.object.isRequired,
};

const mapStateToProps = state => ({});

const mapDispatchToProps = {};

export default connect(mapStateToProps, mapDispatchToProps)(FoodCard);
