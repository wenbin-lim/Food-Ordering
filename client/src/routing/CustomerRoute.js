import React from 'react';
import PropTypes from 'prop-types';
import { connect } from 'react-redux';
import { Route, Navigate, useParams } from 'react-router-dom';

// Components
import Spinner from '../components/layout/Spinner';

const CustomerRoute = ({
  component: Component,
  path,
  minAccessLevel = 0,
  loading,
  companies,
  auth,
  children,
  ...rest
}) => {
  const { companyName } = useParams();

  const company = companies.find(company => company.name === companyName);

  if (loading) {
    return <Spinner fullscreen={true} />;
  } else {
    if (company) {
      if (auth.access >= minAccessLevel) {
        return (
          <Route
            path={path}
            element={<Component auth={auth} company={company} {...rest} />}
          >
            {children}
          </Route>
        );
      }
    }
    return <Navigate to='/' />;
  }
};

CustomerRoute.propTypes = {
  component: PropTypes.elementType.isRequired,
  path: PropTypes.string.isRequired,
  minAccessLevel: PropTypes.number,
  companies: PropTypes.array.isRequired,
};

const mapStateToProps = state => ({
  loading: state.app.companiesLoading,
  companies: state.app.companies,
  auth: state.auth,
});

const mapDispatchToProps = {};

export default connect(mapStateToProps, mapDispatchToProps)(CustomerRoute);
