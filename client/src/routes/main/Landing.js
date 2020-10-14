import React, { Fragment, useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import { connect } from 'react-redux';

// Misc
import axios from 'axios';
import { v4 as uuid } from 'uuid';

// Components
import Button from '../../components/layout/Button';
import Container from '../../components/layout/Container';
import ImageInput from '../../components/layout/ImageInput';
import FoodTableIcon from '../../components/icons/FoodTableIcon';
import BellIcon from '../../components/icons/BellIcon';

const Landing = ({ companies }) => {
  const [tables, setTables] = useState([]);
  useEffect(() => {
    /* Functions to run on mount */

    const getTables = async () => {
      const res = await axios.get('/api/tables');

      setTables(res.data);
    };

    getTables();

    return () => {
      /* Functions to run before unmount */
    };
    // eslint-disable-next-line
  }, []);

  return (
    <Container
      parentStyle={{
        display: 'grid',
        gridTemplateRows: 'auto 1fr',
      }}
      parentContent={
        <Fragment>
          <h1 className='heading-1 text-center'>Wawaya</h1>
          <div>
            <p className='body-1 text-center'>This is the landing page</p>
            <div
              style={{
                marginTop: '1rem',
                display: 'flex',
                justifyContent: 'space-around',
              }}
            >
              {companies &&
                companies.map(company => (
                  <div
                    key={uuid()}
                    style={{
                      display: 'flex',
                      flexDirection: 'column',
                      flex: '1',
                      alignItems: 'center',
                    }}
                  >
                    <img
                      src={company.logo && company.logo.large}
                      alt={`${company.name}-logo`}
                      style={{
                        height: '64px',
                        maxWidth: '100%',
                      }}
                    />
                    <Link to={`/ordernow/${company.name}`}>
                      {company.displayedName.toUpperCase()}
                    </Link>
                    <h3
                      className='heading-3'
                      style={{
                        margin: '0.5rem 0',
                      }}
                    >
                      Tables QR Code links
                    </h3>
                    {tables &&
                      tables.map(
                        table =>
                          table.company.name === company.name && (
                            <Link
                              key={uuid()}
                              to={`/ordernow/${company.name}?company=${company._id}&table=${table._id}`}
                            >
                              {table.name}
                            </Link>
                          )
                      )}
                    <Link
                      to={`/ordernow/${company.name}?company=${company._id}&table=somethingrandom`}
                    >
                      {`fake table link for ${company.name}`}
                    </Link>
                  </div>
                ))}
            </div>
          </div>
        </Fragment>
      }
    />
  );
};

Landing.propTypes = {};

const mapStateToProps = state => ({
  companies: state.app.companies,
});

const mapDispatchToProps = {};

export default connect(mapStateToProps, mapDispatchToProps)(Landing);
