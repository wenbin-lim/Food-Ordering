import React from 'react';
import PropTypes from 'prop-types';
import { connect } from 'react-redux';
import { Route, Navigate, useParams } from 'react-router-dom';

// Components
import Spinner from '../components/layout/Spinner';

const CompanyRoute = ({
  component: Component,
  path,
  minAccess = 2,
  companiesLoading,
  companies,
  auth,
  children,
  ...rest
}) => {
  const { companyName } = useParams();

  // companies is loaded with getCompaniesPublic in App.js
  const foundCompany = companies.find(company => company.name === companyName);
  const { _id: foundCompanyId } = { ...foundCompany };

  const { loading: userLoading, user } = auth;
  const {
    _id: userId,
    access: userAccess,
    role: userRole,
    company: userCompany,
  } = { ...user };
  const { _id: userCompanyId, name: userCompanyName } = { ...userCompany };

  return companiesLoading || userLoading ? (
    <Spinner fullscreen={true} />
  ) : foundCompanyId === userCompanyId ? (
    userAccess >= minAccess ? (
      <Route
        path={path}
        element={
          <Component
            userId={userId}
            userAccess={userAccess}
            userRole={userRole}
            userCompanyId={userCompanyId}
            userCompanyName={userCompanyName}
            userCompany={foundCompany}
            {...rest}
          />
        }
      >
        {children}
      </Route>
    ) : (
      <Navigate to={`/${userCompanyName}`} replace={true} />
    )
  ) : (
    <Navigate to='/' replace={true} />
  );
};

CompanyRoute.propTypes = {
  component: PropTypes.elementType.isRequired,
  path: PropTypes.string.isRequired,
  minAccess: PropTypes.number,
  companiesLoading: PropTypes.bool.isRequired,
  companies: PropTypes.array.isRequired,
  auth: PropTypes.object.isRequired,
};

const mapStateToProps = state => ({
  companies: state.app.companies,
  companiesLoading: state.app.companiesLoading,
  auth: state.auth,
});

const mapDispatchToProps = {};

export default connect(mapStateToProps, mapDispatchToProps)(CompanyRoute);
