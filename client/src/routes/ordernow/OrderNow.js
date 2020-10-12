import React, { useEffect, useState, Fragment } from 'react';
import { Link, useMatch, Outlet } from 'react-router-dom';

// Components
import Container from '../../components/layout/Container';
import Preloader from '../../components/layout/Preloader';

// Misc
import { v4 as uuid } from 'uuid';
import axios from 'axios';

/* 
  =====
  Props
  =====
  @name       Prop 
  @type       type
  @desc       description
  @required   true
  @default    none
*/
export const OrderNow = () => {
  const [companies, setCompanies] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const getCompanies = async () => {
      const res = await axios.get('/api/companies/public');

      setCompanies(res.data);
      setLoading(false);
    };
    getCompanies();

    // eslint-disable-next-line
  }, []);

  const match = useMatch('/ordernow');

  const content = match ? (
    <Fragment>
      <h1 className='heading-1 text-center'>Order Now</h1>
      <div
        style={{
          display: 'flex',
          justifyContent: 'space-evenly',
        }}
      >
        {loading ? (
          <Preloader height={24} />
        ) : (
          companies.map(company => (
            <div key={uuid()}>
              <Link to={company.name} className='caption'>
                {company.displayedName}
              </Link>
              <br />
              <Link
                to={`${company.name}?companyname=${company.name}&company=${company._id}&table=5f7e29d80374c240fc1e1a80`}
                className='caption'
              >
                table url
              </Link>
            </div>
          ))
        )}
      </div>
    </Fragment>
  ) : (
    <Outlet />
  );

  return (
    <Container
      parentStyle={{
        display: 'grid',
        gridTemplateRows: 'auto 1fr',
      }}
      parentContent={content}
    />
  );
};

export default OrderNow;
