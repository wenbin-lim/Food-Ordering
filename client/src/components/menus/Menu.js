import React, { useState, useEffect, Fragment } from 'react';
import PropTypes from 'prop-types';
import { connect } from 'react-redux';
import { useParams, useNavigate, Outlet } from 'react-router-dom';

// Components
import Container from '../layout/Container';
import MainMenuPreloader from '../preloaders/MainMenuPreloader';
import FoodCard from '../foods/FoodCard';

// Actions
import { setSnackbar } from '../../actions/app';

const Menu = ({ menus: { menusLoading, menus }, setSnackbar }) => {
  let { id } = useParams();
  const navigate = useNavigate();

  const [menu, setMenu] = useState();

  useEffect(() => {
    if (Array.isArray(menus) && menus.length > 0) {
      let foundMenu = menus.find(menu => menu._id === id && menu.availability);

      if (foundMenu) {
        setMenu(foundMenu);
      } else {
        setSnackbar(
          'An unexpected error occured, please try again later!',
          'error'
        );
        console.error(`Menu of id [${id}] not found or unavailable`);
        navigate('../');
      }
    }

    // eslint-disable-next-line
  }, [id, menusLoading, menus]);

  const menuContent =
    menusLoading || !menu ? (
      <MainMenuPreloader />
    ) : (
      menu && (
        <article className='menu'>
          <header className='menu-header'>
            <h1 className='menu-header-title text-center'>{menu.name}</h1>
          </header>

          <article className='menu-content'>
            {Array.isArray(menu.foods) && menu.foods.length > 0 ? (
              <Fragment>
                {menu.foods
                  .filter(food => food.availability)
                  .map(food => (
                    <FoodCard key={food._id} food={food} />
                  ))}
              </Fragment>
            ) : (
              <p className='caption'>No food found</p>
            )}
          </article>
        </article>
      )
    );

  return (
    <Container
      parentClass={'menu-wrapper'}
      parentContent={menuContent}
      parentSize={3}
      childContent={<Outlet />}
      childSize={2}
    />
  );
};

Menu.propTypes = {
  menus: PropTypes.object.isRequired,
  setSnackbar: PropTypes.func.isRequired,
};

const mapStateToProps = state => ({
  menus: state.menus,
});

const mapDispatchToProps = {
  setSnackbar,
};

export default connect(mapStateToProps, mapDispatchToProps)(Menu);
