import React, { useEffect, Fragment } from 'react';
import PropTypes from 'prop-types';
import { connect } from 'react-redux';
import { useParams, useNavigate } from 'react-router-dom';

// Actions
import { getMenu } from '../../actions/menus';

// Components
import SideSheet from '../layout/SideSheet';
import Spinner from '../layout/Spinner';
import FoodItem from '../foods/FoodItem';

const MenuInfo = ({ menus: { requesting, menu }, getMenu }) => {
  let { id } = useParams();
  const navigate = useNavigate();

  useEffect(() => {
    getMenu(id);

    // eslint-disable-next-line
  }, [id]);

  const { _id: menuId, name, availability, isMain, index, foods } = {
    ...menu,
  };

  const closeSideSheet = () => navigate('../');

  const sideSheetContent =
    requesting || menuId !== id ? (
      <Spinner />
    ) : (
      <Fragment>
        {typeof index === 'number' && (
          <div className='row'>
            <div className='col'>
              <p className='caption'>Position in Sidebar Menu</p>
              <p className='body-1'>{index}</p>
            </div>
          </div>
        )}

        {typeof isMain === 'boolean' && (
          <div className='row'>
            <div className='col'>
              <p className='caption'>Displayed in Main Menu ?</p>
              <span className={`badge badge-${isMain ? 'success' : 'error'}`}>
                {isMain ? 'Yes' : 'No'}
              </span>
            </div>
          </div>
        )}

        {Array.isArray(foods) && (
          <div className='row'>
            <div className='col'>
              <p className='caption'>Foods under this menu</p>
              {foods.length > 0 ? (
                foods.map(food => (
                  <FoodItem
                    classes={'mb-h'}
                    color={'surface2'}
                    key={food._id}
                    editable={false}
                    food={food}
                  />
                ))
              ) : (
                <p className='body-1'>No food found</p>
              )}
            </div>
          </div>
        )}
      </Fragment>
    );

  return (
    <SideSheet
      wrapper={false}
      headerTitle={!requesting || menuId === id ? name : null}
      headerContent={
        (!requesting || menuId === id) && availability === false ? (
          <span className='badge badge-error'>Unavailable</span>
        ) : null
      }
      closeSideSheetHandler={closeSideSheet}
      content={sideSheetContent}
    />
  );
};

MenuInfo.propTypes = {
  getMenu: PropTypes.func.isRequired,
  menus: PropTypes.object.isRequired,
};

const mapStateToProps = state => ({
  menus: state.menus,
});

const mapDispatchToProps = { getMenu };

export default connect(mapStateToProps, mapDispatchToProps)(MenuInfo);
