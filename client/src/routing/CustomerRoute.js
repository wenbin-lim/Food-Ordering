import React from 'react';
import PropTypes from 'prop-types';
import { connect } from 'react-redux';
import { Route, Navigate, useParams } from 'react-router-dom';

// Components
import Spinner from '../components/layout/Spinner';

const CustomerRoute = ({
  component: Component,
  path,
  companiesLoading,
  companies,
  customer,
  children,
  ...rest
}) => {
  const { companyName } = useParams();

  // companies is loaded with getCompaniesPublic in App.js
  const foundCompany = companies.find(company => company.name === companyName);
  const { _id: foundCompanyId } = { ...foundCompany };

  const { loading: customerLoading, table } = customer;
  const {
    _id: customerId,
    name: customerTableName,
    company: customerCompany,
  } = { ...table };
  const { _id: customerCompanyId, name: customerCompanyName } = {
    ...customerCompany,
  };

  return companiesLoading || customerLoading ? (
    <Spinner fullscreen={true} />
  ) : foundCompanyId === customerCompanyId ? (
    <Route
      path={path}
      element={
        <Component
          customerId={customerId}
          customerTableName={customerTableName}
          customerCompanyId={customerCompanyId}
          customerCompanyName={customerCompanyName}
          customerCompany={foundCompany}
          {...rest}
        />
      }
    >
      {children}
    </Route>
  ) : (
    <Navigate to='/' replace={true} />
  );
};

CustomerRoute.propTypes = {
  component: PropTypes.elementType.isRequired,
  path: PropTypes.string.isRequired,
  companiesLoading: PropTypes.bool.isRequired,
  companies: PropTypes.array.isRequired,
  customer: PropTypes.object,
};

const mapStateToProps = state => ({
  companies: state.app.companies,
  companiesLoading: state.app.companiesLoading,
  customer: state.customer,
});

const mapDispatchToProps = {};

export default connect(mapStateToProps, mapDispatchToProps)(CustomerRoute);
