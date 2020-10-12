import React, { useEffect, useRef, Fragment } from 'react';
import PropTypes from 'prop-types';
import { Outlet, useNavigate } from 'react-router-dom';

// Components
import Container from '../../components/layout/Container';
import Button from '../../components/layout/Button';

/* 
  =====
  Props
  =====
  @name       auth 
  @type       object
  @desc       auth state from CustomerRoute
  @required   true

  @name       company 
  @type       object
  @desc       company state from CustomerRoute
  @required   true
*/
export const CustomerLanding = ({ auth: { company, auth } }) => {
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
  }, [auth.name]);

  const parentContent = (
    <Fragment>
      <section className='table-info'>
        <h2 className='table-info-caption heading-2'>TABLE</h2>
        <p className='table-info-name' ref={tableInfoNameRef}>
          {auth.name}
        </p>
      </section>
      <section className='button-group'>
        <Button
          text={'ORDER'}
          btnStyle={'contained'}
          type={'primary'}
          block={true}
          onClick={() => navigate(`menu`)}
        />
        <Button
          text={'ASSISTANCE'}
          btnStyle={'contained'}
          type={'primary'}
          block={true}
          // onClick={() => navigate(`/${company.name}/table/menu`)}
        />
        <Button
          text={'PAY BILL'}
          btnStyle={'contained'}
          type={'primary'}
          block={true}
          // onClick={() => navigate(`/${company.name}/table/menu`)}
        />
      </section>
      <Outlet />
    </Fragment>
  );
  return (
    <Container
      parentClass={'customer-qr-landing'}
      parentContent={parentContent}
    />
  );
};

CustomerLanding.propTypes = {
  auth: PropTypes.object.isRequired,
};

export default CustomerLanding;
