import React from 'react';
import PropTypes from 'prop-types';
import { useNavigate } from 'react-router-dom';

// Components
import Container from '../layout/Container';
import MainMenuPreloader from '../preloaders/MainMenuPreloader';
import FoodCard from '../foods/FoodCard';
import Button from '../layout/Button';

// Hooks
import useGetAll from '../../query/hooks/useGetAll';
import useErrors from '../../hooks/useErrors';

const MainMenu = ({ company }) => {
  const { data: menus, isLoading, errors } = useGetAll('menus', { company });
  useErrors(errors);

  const navigate = useNavigate();

  return (
    <Container className='menu-wrapper'>
      {isLoading ? (
        <MainMenuPreloader />
      ) : Array.isArray(menus) && menus.length > 0 ? (
        menus
          .filter(menu => menu.availability)
          .map(({ _id: menuId, name, foods }) => (
            <article key={menuId} className='menu'>
              <header className='menu-header'>
                <h1 className='menu-header-title'>{name}</h1>
                <Button
                  classes={'menu-header-btn'}
                  text={'see all'}
                  small={true}
                  onClick={() => navigate(`${menuId}`)}
                />
              </header>
              <article className='menu-content allow-horizontal-scroll'>
                {Array.isArray(foods) && foods.length > 0 ? (
                  foods
                    .filter(food => food.availability)
                    .map(food => <FoodCard key={food._id} food={food} />)
                ) : (
                  <p className='caption'>No food found</p>
                )}
              </article>
            </article>
          ))
      ) : (
        <h1 className='heading-1'>No menus found</h1>
      )}
    </Container>
  );
};

MainMenu.propTypes = {
  company: PropTypes.string,
};

export default MainMenu;
