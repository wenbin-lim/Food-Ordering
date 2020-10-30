import React from 'react';
import PropTypes from 'prop-types';
import { connect } from 'react-redux';
import { Route, Navigate, useParams } from 'react-router-dom';

// Components
import Spinner from '../components/layout/Spinner';

const CompanyRoute = ({
  component: Component,
  path,
  minAccessLevel = 2,
  companies: { companiesLoading, companies },
  auth,
  authLoading,
  access,
  authCompany,
  children,
  ...rest
}) => {
  const { companyName } = useParams();

  // companies is loaded with getCompaniesPublic in App.js
  const company = companies.find(company => company.name === companyName);

  if (companiesLoading || authLoading) {
    return <Spinner fullscreen={true} />;
  } else {
    // if there is a company for this route
    if (company && authCompany) {
      if (authCompany._id === company._id && access >= minAccessLevel) {
        return (
          <Route path={path} element={<Component auth={auth} {...rest} />}>
            {children}
          </Route>
        );
      }
    }
    return <Navigate to='/' />;
  }
};

CompanyRoute.propTypes = {
  component: PropTypes.elementType.isRequired,
  path: PropTypes.string.isRequired,
  minAccessLevel: PropTypes.number,
  companies: PropTypes.object.isRequired,
  auth: PropTypes.object.isRequired,
  authLoading: PropTypes.bool.isRequired,
  access: PropTypes.number.isRequired,
  authCompany: PropTypes.object,
};

const mapStateToProps = state => ({
  companies: state.app,
  auth: state.auth,
  authLoading: state.auth.loading,
  access: state.auth.access,
  authCompany: state.auth.company,
});

const mapDispatchToProps = {};

export default connect(mapStateToProps, mapDispatchToProps)(CompanyRoute);
