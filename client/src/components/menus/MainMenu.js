import React, { Fragment } from 'react';
import PropTypes from 'prop-types';
import { connect } from 'react-redux';
import { useNavigate, Outlet } from 'react-router-dom';

// Components
import Container from '../layout/Container';
import MainMenuPreloader from '../preloaders/MainMenuPreloader';
import FoodCard from '../foods/FoodCard';
import Button from '../layout/Button';

const MainMenu = ({ menus: { menusLoading, menus } }) => {
  const navigate = useNavigate();

  const mainMenuContent =
    menusLoading || !Array.isArray(menus) ? (
      <MainMenuPreloader />
    ) : (
      <Fragment>
        {menus
          .filter(menu => menu.availability)
          .map(menu => (
            <article key={menu._id} className='menu'>
              <header className='menu-header'>
                <h1 className='menu-header-title'>{menu.name}</h1>
                <Button
                  classes={'menu-header-btn'}
                  text={'see all'}
                  small={true}
                  onClick={() => navigate(`${menu._id}`)}
                />
              </header>
              <article className='menu-content allow-horizontal-scroll'>
                {Array.isArray(menu.foods) && menu.foods.length > 0 ? (
                  <Fragment>
                    {menu.foods
                      .filter(food => food.availability)
                      .map(food => (
                        <FoodCard key={`${menu._id}-${food._id}`} food={food} />
                      ))}
                  </Fragment>
                ) : (
                  <p className='caption'>No food found</p>
                )}
              </article>
            </article>
          ))}
      </Fragment>
    );

  return (
    <Container
      parentClass={'menu-wrapper'}
      parentContent={mainMenuContent}
      parentSize={3}
      childContent={<Outlet />}
      childSize={2}
    />
  );
};

MainMenu.propTypes = {
  menus: PropTypes.object.isRequired,
};

const mapStateToProps = state => ({
  menus: state.menus,
});

const mapDispatchToProps = {};

export default connect(mapStateToProps, mapDispatchToProps)(MainMenu);
