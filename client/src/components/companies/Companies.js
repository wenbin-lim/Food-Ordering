import React from 'react';
import { Outlet, useNavigate } from 'react-router-dom';

// Components
import Container from '../layout/Container';
import List from '../layout/List';
import FixedActionButtons from '../layout/FixedActionButtons';
import Button from '../layout/Button';

import CompanyItem from './CompanyItem';

// Icons
import PlusIcon from '../icons/PlusIcon';
// Hooks
import useGet from '../../query/hooks/useGet';
import useErrors from '../../hooks/useErrors';

const Companies = () => {
  const { data: companies, isLoading, error } = useGet('companies', {
    route: '/api/companies',
  });
  useErrors(error);

  const navigate = useNavigate();

  return (
    <Container sidesheet={true}>
      <Container.Parent>
        <List>
          <List.Items
            loading={isLoading}
            error={error}
            array={companies}
            itemElement={<CompanyItem />}
          />

          <FixedActionButtons>
            <Button
              fill='contained'
              type='primary'
              icon={<PlusIcon />}
              onClick={() => navigate('add')}
            />
          </FixedActionButtons>
        </List>
      </Container.Parent>

      <Container.Child className='sidesheet'>
        <Outlet />
      </Container.Child>
    </Container>
  );
};

export default Companies;
