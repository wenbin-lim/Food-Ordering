import React, { Fragment } from 'react';

// Components
import Container from '../../components/layout/Container';

const About = () => {
  return (
    <Container
      parentStyle={{
        display: 'grid',
        gridTemplateRows: 'auto 1fr',
      }}
      parentContent={
        <Fragment>
          <h1 className='heading-1'>Wawaya Food App</h1>
          <div>
            <p className='body-1'>This is the About page</p>
          </div>
        </Fragment>
      }
    />
  );
};

export default About;
