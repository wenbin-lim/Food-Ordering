import React from 'react';
import PropTypes from 'prop-types';
import { connect } from 'react-redux';
import { Route, Navigate, useParams } from 'react-router-dom';

const CompanyRoute = ({
  component: Component,
  path,
  minAccessLevel = 2,
  companies,
  auth,
  children,
  ...rest
}) => {
  const { companyName } = useParams();
  const { auth: authUser, access: authAccess, company: authCompany } = auth;

  const company = companies.find(company => company.name === companyName);

  // if there is a company for this route
  if (company) {
    // check if authUser, authAccess and authCompany exists
    if (authUser && authAccess && authCompany) {
      if (authCompany._id === company._id && authAccess >= minAccessLevel) {
        return (
          <Route path={path} element={<Component auth={auth} {...rest} />}>
            {children}
          </Route>
        );
      }
    }
  }

  return <Navigate to='/' />;
};

CompanyRoute.propTypes = {
  component: PropTypes.elementType.isRequired,
  path: PropTypes.string.isRequired,
  minAccessLevel: PropTypes.number,
  companies: PropTypes.array.isRequired,
};

const mapStateToProps = state => ({
  companies: state.app.companies,
  auth: state.auth,
});

const mapDispatchToProps = {};

export default connect(mapStateToProps, mapDispatchToProps)(CompanyRoute);
