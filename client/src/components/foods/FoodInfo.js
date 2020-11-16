import React from 'react';
import { useParams, useNavigate } from 'react-router-dom';

// Components
import SideSheet from '../layout/SideSheet';
import Spinner from '../layout/Spinner';

// Misc
import { v4 as uuid } from 'uuid';

// Hooks
import useGetOne from '../../query/hooks/useGetOne';
import useErrors from '../../hooks/useErrors';

const FoodInfo = () => {
  let { id } = useParams();
  const navigate = useNavigate();
  const { data: food, isLoading, error } = useGetOne('food', id);
  useErrors(error);

  const {
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
    customisations,
  } = {
    ...food,
  };

  return (
    <SideSheet wrapper={false}>
      <SideSheet.Header title={name} closeHandler={() => navigate('../')}>
        {availability === false && (
          <span className='badge badge-error'>Unavailable</span>
        )}
      </SideSheet.Header>
      {isLoading || error ? (
        <Spinner />
      ) : (
        <SideSheet.Content>
          {(typeof price === 'number' ||
            typeof promotionPrice === 'number') && (
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
                <p className='body-2'>{desc}</p>
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
                <p className='caption mb-h'>Allergics</p>
                {allergics.length > 0
                  ? allergics.map(allergy => (
                      <span key={uuid()} className='chip mr-h'>
                        {allergy}
                      </span>
                    ))
                  : 'No allergics defined'}
              </div>
            </div>
          )}

          {Array.isArray(tags) && (
            <div className='row'>
              <div className='col'>
                <p className='caption mb-h'>tags</p>
                {tags.length > 0
                  ? tags.map(tag => (
                      <span key={uuid()} className='chip mr-h'>
                        {tag}
                      </span>
                    ))
                  : 'No tags defined'}
              </div>
            </div>
          )}

          {typeof allowAdditionalInstruction === 'boolean' && (
            <div className='row'>
              <div className='col'>
                <p className='caption mb-h'>Allow additional instructions ?</p>
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

          {Array.isArray(customisations) && (
            <div className='row'>
              <div className='col'>
                <p className='caption'>Customisations</p>
                {customisations.length > 0 ? (
                  customisations.map(({ name }) => (
                    <p className='body-2'>{name}</p>
                  ))
                ) : (
                  <p className='body-1'>No customisations defined yet</p>
                )}
              </div>
            </div>
          )}

          {image && (
            <div className='row'>
              <div className='col place-items-center'>
                <img src={image} alt={`food-${name}`} />
              </div>
            </div>
          )}
        </SideSheet.Content>
      )}
    </SideSheet>
  );
};

export default FoodInfo;
