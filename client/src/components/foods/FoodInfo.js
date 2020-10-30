import React, { useEffect, Fragment } from 'react';
import PropTypes from 'prop-types';
import { connect } from 'react-redux';
import { useParams, useNavigate } from 'react-router-dom';

// Actions
import { getFood } from '../../actions/foods';

// Components
import SideSheet from '../layout/SideSheet';
import Spinner from '../layout/Spinner';

// Misc
import { v4 as uuid } from 'uuid';

const FoodInfo = ({ foods: { requesting, food }, getFood }) => {
  let { id } = useParams();
  const navigate = useNavigate();

  useEffect(() => {
    getFood(id);

    // eslint-disable-next-line
  }, [id]);

  const {
    _id: foodId,
    availability,
    name,
    price,
    promotionPrice,
    minQty,
    maxQty,
    desc,
    portionSize,
    preparationTime,
    allergics,
    tags,
    allowAdditionalInstruction,
    image,
    // eslint-disable-next-line
    menus,
    // eslint-disable-next-line
    customisations,
  } = {
    ...food,
  };

  const closeSideSheet = () => navigate('../');

  const sideSheetContent =
    requesting || foodId !== id ? (
      <Spinner />
    ) : (
      <Fragment>
        {image && (
          <div className='row'>
            <div className='col place-items-center'>
              <img src={image} alt={`food-${name}`} />
            </div>
          </div>
        )}

        {(typeof price === 'number' || typeof promotionPrice === 'number') && (
          <div className='row'>
            {price && (
              <div className='col'>
                <p className='caption'>price</p>
                <p className='body-1'>${price.toFixed(2)}</p>
              </div>
            )}
            {promotionPrice && (
              <div className='col'>
                <p className='caption'>Promotional Price</p>
                <p className='body-1'>${promotionPrice.toFixed(2)}</p>
              </div>
            )}
          </div>
        )}

        {(typeof minQty === 'number' || typeof maxQty === 'number') && (
          <div className='row'>
            {minQty && (
              <div className='col'>
                <p className='caption'>Min Quantity</p>
                <p className='body-1'>{minQty}</p>
              </div>
            )}
            {maxQty && (
              <div className='col'>
                <p className='caption'>Max Quantity</p>
                <p className='body-1'>{maxQty}</p>
              </div>
            )}
          </div>
        )}

        {desc && (
          <div className='row'>
            <div className='col'>
              <p className='caption'>Description</p>
              <p className='body-1'>{desc}</p>
            </div>
          </div>
        )}

        {typeof portionSize === 'number' && (
          <div className='row'>
            <div className='col'>
              <p className='caption'>Portion Size</p>
              <p className='body-1'>{portionSize}</p>
            </div>
          </div>
        )}

        {preparationTime && (
          <div className='row'>
            <div className='col'>
              <p className='caption'>Preparation Time</p>
              <p className='body-1'>{preparationTime}</p>
            </div>
          </div>
        )}

        {Array.isArray(allergics) && (
          <div className='row'>
            <div className='col'>
              <p className='caption'>Allergics</p>
              <p className='body-1'>
                {allergics.length > 0
                  ? allergics.map(allergy => (
                      <span key={uuid()} className='chip mr-h'>
                        {allergy}
                      </span>
                    ))
                  : 'No allergics defined'}
              </p>
            </div>
          </div>
        )}

        {Array.isArray(tags) && (
          <div className='row'>
            <div className='col'>
              <p className='caption'>tags</p>
              <p className='body-1'>
                {tags.length > 0
                  ? tags.map(tag => (
                      <span key={uuid()} className='chip mr-h'>
                        {tag}
                      </span>
                    ))
                  : 'No tags defined'}
              </p>
            </div>
          </div>
        )}

        {typeof allowAdditionalInstruction === 'boolean' && (
          <div className='row'>
            <div className='col'>
              <p className='caption'>Allow additional instructions ?</p>
              <span
                className={`badge badge-${
                  allowAdditionalInstruction ? 'success' : 'error'
                }`}
              >
                {allowAdditionalInstruction ? 'Yes' : 'No'}
              </span>
            </div>
          </div>
        )}
      </Fragment>
    );

  return (
    <SideSheet
      wrapper={false}
      headerTitle={!requesting || foodId === id ? name : null}
      headerContent={
        (!requesting || foodId === id) && availability === false ? (
          <span className='badge badge-error'>Unavailable</span>
        ) : null
      }
      closeSideSheetHandler={closeSideSheet}
      content={sideSheetContent}
    />
  );
};

FoodInfo.propTypes = {
  getFood: PropTypes.func.isRequired,
  foods: PropTypes.object.isRequired,
};

const mapStateToProps = state => ({
  foods: state.foods,
});

const mapDispatchToProps = { getFood };

export default connect(mapStateToProps, mapDispatchToProps)(FoodInfo);
