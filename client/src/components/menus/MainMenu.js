import React, { Fragment } from 'react';
import PropTypes from 'prop-types';
import { connect } from 'react-redux';
import { useNavigate } from 'react-router-dom';

// Components
import Container from '../layout/Container';
import MainMenuPreloader from '../preloaders/MainMenuPreloader';
import FoodCard from './FoodCard';
import Button from '../layout/Button';

const MainMenu = ({ menus: { menusLoading, menus } }) => {
  const navigate = useNavigate();

  const mainMenuContent = menusLoading ? (
    <MainMenuPreloader />
  ) : (
    <Fragment>
      {menus
        .filter(menu => menu.isMain)
        .map(menu => (
          <section key={menu._id} className='mainmenu'>
            <section className='mainmenu-header'>
              <h1 className='heading-1'>{menu.name}</h1>
              <Button
                text={'see all'}
                onClick={() => navigate(`${menu._id}`)}
              />
            </section>
            <section className='mainmenu-content'>
              {Array.isArray(menu.foods) && menu.foods.length > 0 ? (
                <Fragment>
                  {menu.foods.map(food => (
                    <FoodCard key={`${menu._id}-${food._id}`} food={food} />
                  ))}
                </Fragment>
              ) : (
                <p className='caption'>No food found</p>
              )}
            </section>
          </section>
        ))}
    </Fragment>
  );

  return <Container parentContent={mainMenuContent} />;
};

MainMenu.propTypes = {
  menus: PropTypes.object.isRequired,
};

const mapStateToProps = state => ({
  menus: state.menus,
});

const mapDispatchToProps = {};

export default connect(mapStateToProps, mapDispatchToProps)(MainMenu);
