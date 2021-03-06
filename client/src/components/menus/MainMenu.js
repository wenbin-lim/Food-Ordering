import React, { useState } from 'react';
import PropTypes from 'prop-types';
import { useNavigate } from 'react-router-dom';

// Components
import Container from '../layout/Container';
import MainMenuPreloader from '../preloaders/MainMenuPreloader';
import FoodCard from '../foods/FoodCard';
import Button from '../layout/Button';
import FixedActionButtons from '../layout/FixedActionButtons';

import AssistanceReasonsDialog from '../customer/AssistanceReasonsDialog';

// Icons
import HotelBellIcon from '../icons/HotelBellIcon';

// Hooks
import useGet from '../../query/hooks/useGet';
import useErrors from '../../hooks/useErrors';

const MainMenu = ({
  company,
  user: { table },
  companyDetails: { assistanceReasons },
}) => {
  const [
    showAssistanceReasonsDialog,
    setShowAssistanceReasonsDialog,
  ] = useState(false);

  const { data: menus, isLoading, error } = useGet('menus', {
    route: '/api/menus',
    params: { company },
  });
  useErrors(error);

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

MainMenu.propTypes = {
  company: PropTypes.string,
  user: PropTypes.object,
  companyDetails: PropTypes.object,
};

export default MainMenu;
