import React, { useEffect, useRef } from 'react';
import PropTypes from 'prop-types';
import { useNavigate } from 'react-router-dom';

// Components
import Container from '../../components/layout/Container';
import Button from '../../components/layout/Button';

const CustomerLanding = ({ user }) => {
  const navigate = useNavigate();
  const tableInfoNameRef = useRef(null);

  useEffect(() => {
    const tableInfoName = tableInfoNameRef.current;

    if (tableInfoName) {
      const tableNameLength = tableInfoName.innerText.length;

      if (tableNameLength > 20) {
        tableInfoName.style.fontSize = '2rem';
      } else if (tableNameLength > 10) {
        tableInfoName.style.fontSize = '3rem';
      } else if (tableNameLength > 3) {
        tableInfoName.style.fontSize = '5rem';
      } else {
        tableInfoName.style.fontSize = '10rem';
      }
    }
  }, [user]);

  return (
    <Container className='customer-qr-landing'>
      <section className='table-info'>
        <h2 className='table-info-caption'>TABLE</h2>
        <p className='table-info-name' ref={tableInfoNameRef}>
          {user?.name}
        </p>
      </section>

      <section className='button-group'>
        <Button
          text={'ORDER'}
          fill={'contained'}
          type={'primary'}
          block={true}
          onClick={() => navigate(`menu`)}
        />
        <Button
          text={'ASSISTANCE'}
          fill={'contained'}
          type={'primary'}
          block={true}
          // onClick={() => navigate(`/${company.name}/table/menu`)}
        />
        <Button
          text={'PAY BILL'}
          fill={'contained'}
          type={'primary'}
          block={true}
          // onClick={() => navigate(`/${company.name}/table/menu`)}
        />
      </section>
    </Container>
  );
};

CustomerLanding.propTypes = {
  table: PropTypes.object,
};

export default CustomerLanding;
