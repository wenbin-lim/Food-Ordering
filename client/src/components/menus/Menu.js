import React, { useState } from 'react';
import PropTypes from 'prop-types';
import { useParams, Navigate } from 'react-router-dom';

// Components
import Container from '../layout/Container';
import FixedActionButtons from '../layout/FixedActionButtons';
import Button from '../layout/Button';
import MainMenuPreloader from '../preloaders/MainMenuPreloader';

import FoodCard from '../foods/FoodCard';
import AssistanceReasonsDialog from '../customer/AssistanceReasonsDialog';

// Icons
import HotelBellIcon from '../icons/HotelBellIcon';

// Hooks
import useGetOne from '../../query/hooks/useGetOne';
import useErrors from '../../hooks/useErrors';

const Menu = ({ user: { table }, companyDetails: { assistanceReasons } }) => {
  let { id } = useParams();

  const [
    showAssistanceReasonsDialog,
    setShowAssistanceReasonsDialog,
  ] = useState(false);

  const { data: menu, isLoading, error } = useGetOne('menu', id, {
    route: `/api/menus/${id}`,
  });
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

      {table && (
        <FixedActionButtons fixedToParentElement={false}>
          <Button
            fill='contained'
            type='primary'
            icon={<HotelBellIcon />}
            onClick={() => setShowAssistanceReasonsDialog(true)}
          />
        </FixedActionButtons>
      )}
      {showAssistanceReasonsDialog && (
        <AssistanceReasonsDialog
          assistanceReasons={assistanceReasons}
          tableName={table?.name}
          onCloseAssistanceReasonsDialog={() =>
            setShowAssistanceReasonsDialog(false)
          }
        />
      )}
    </Container>
  );
};

Menu.propTypes = {
  user: PropTypes.object,
  companyDetails: PropTypes.object,
};

export default Menu;
