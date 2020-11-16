import React from 'react';
import { useParams, useNavigate } from 'react-router-dom';

// Components
import SideSheet from '../layout/SideSheet';
import Spinner from '../layout/Spinner';
import FoodItem from '../foods/FoodItem';

// Hooks
import useGetOne from '../../query/hooks/useGetOne';
import useErrors from '../../hooks/useErrors';

const MenuInfo = () => {
  let { id } = useParams();
  const navigate = useNavigate();

  const { data: menu, isLoading, error } = useGetOne('menu', id);
  useErrors(error);

  const { name, availability, index, foods } = {
    ...menu,
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
          {typeof index === 'number' && (
            <div className='row'>
              <div className='col'>
                <p className='caption'>Menu Index</p>
                <p className='body-1'>{index}</p>
              </div>
            </div>
          )}

          {Array.isArray(foods) && (
            <div className='row'>
              <div className='col'>
                <p className='caption mb-h'>Food under this menu</p>
                {foods.length > 0 ? (
                  foods.map(food => (
                    <FoodItem
                      className={'mb-h'}
                      key={food._id}
                      data={food}
                      editable={false}
                    />
                  ))
                ) : (
                  <p className='body-1'>No food found</p>
                )}
              </div>
            </div>
          )}
        </SideSheet.Content>
      )}
    </SideSheet>
  );
};

export default MenuInfo;
