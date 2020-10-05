import React, { Fragment } from 'react';

// Components
import Container from '../layout/Container';

const Landing = () => {
  return (
    <Container
      parentStyle={{
        display: 'grid',
        gridTemplateRows: 'auto 1fr',
      }}
      parentContent={
        <Fragment>
          <h1 className='heading-1'>Landing Page</h1>
        </Fragment>
      }
    />
  );
};

export default Landing;
