import React, { useState, useEffect, Fragment } from 'react';
import PropTypes from 'prop-types';
import { connect } from 'react-redux';
import { useParams, useNavigate } from 'react-router-dom';

// Components
import Container from '../layout/Container';
import MainMenuPreloader from '../preloaders/MainMenuPreloader';
import FoodCard from './FoodCard';

// Actions
import { setSnackbar } from '../../actions/app';

const Menu = ({ menus: { menusLoading, menus }, setSnackbar }) => {
  let { id } = useParams();
  const navigate = useNavigate();

  const [menu, setMenu] = useState();

  useEffect(() => {
    if (Array.isArray(menus) && menus.length > 0) {
      let foundMenu = menus.find(menu => menu._id === id);

      if (foundMenu) {
        setMenu(foundMenu);
      } else {
        setSnackbar(
          'An unexpected error occured, please try again later!',
          'error'
        );
        console.error(`Menu of id [${id}] not found`);
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
        <Fragment>
          <header className='menu-header'>
            <h1 className='heading-1'>{menu.name}</h1>
          </header>
          <main className='menu-content'>
            {Array.isArray(menu.foods) && menu.foods.length > 0 ? (
              <Fragment>
                {menu.foods.map(food => (
                  <FoodCard key={food._id} food={food} />
                ))}
              </Fragment>
            ) : (
              <p className='caption'>No food found</p>
            )}
          </main>
        </Fragment>
      )
    );

  return <Container parentClass={'menu'} parentContent={menuContent} />;
};

Menu.propTypes = {
  menus: PropTypes.object.isRequired,
};

const mapStateToProps = state => ({
  menus: state.menus,
});

const mapDispatchToProps = {
  setSnackbar,
};

export default connect(mapStateToProps, mapDispatchToProps)(Menu);
