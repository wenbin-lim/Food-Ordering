import React from 'react';
import { useParams, Navigate } from 'react-router-dom';

// Components
import Container from '../layout/Container';
import MainMenuPreloader from '../preloaders/MainMenuPreloader';
import FoodCard from '../foods/FoodCard';

// Hooks
import useGetOne from '../../query/hooks/useGetOne';
import useErrors from '../../hooks/useErrors';

const Menu = () => {
  let { id } = useParams();

  const { data: menu, isLoading, error } = useGetOne('menu', id);
  useErrors(error);

  const { name, foods } = { ...menu };

  return (
    <Container className='menu-wrapper'>
      {isLoading ? (
        <MainMenuPreloader />
      ) : menu ? (
        <article className='menu'>
          <header className='menu-header'>
            <h1 className='menu-header-title text-center'>{name}</h1>
          </header>

          <article className='menu-content'>
            {Array.isArray(foods) && foods.length > 0 ? (
              foods
                .filter(food => food.availability)
                .map(food => <FoodCard key={food._id} food={food} />)
            ) : (
              <p className='caption'>No food found</p>
            )}
          </article>
        </article>
      ) : (
        <Navigate to='../' replace={true} />
      )}
    </Container>
  );
};

export default Menu;
