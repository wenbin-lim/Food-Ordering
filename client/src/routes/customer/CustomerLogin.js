import React, { useEffect } from 'react';
import PropTypes from 'prop-types';
import { connect } from 'react-redux';
import { useSearchParams, useNavigate } from 'react-router-dom';

// Components
import Spinner from '../../components/layout/Spinner';

// Actions
import { customerLogin } from '../../actions/customer';

const CustomerLogin = ({ customerLogin }) => {
  let [searchParams] = useSearchParams();
  const navigate = useNavigate();

  const tryCustomerLogin = async (companyId, tableId) => {
    const customerLoginSuccess = await customerLogin(companyId, tableId);

    const companyName = customerLoginSuccess?.table?.company?.name;

    return customerLoginSuccess
      ? navigate(`/dinein/${companyName}`, { replace: true })
      : navigate('/', { replace: true });
  };

  useEffect(() => {
    const companyId = searchParams.get('company');
    const tableId = searchParams.get('table');

    if (companyId && tableId) {
      tryCustomerLogin(companyId, tableId);
    } else {
      return navigate('/', { replace: true });
    }

    // eslint-disable-next-line
  }, []);

  return <Spinner fullscreen={true} />;
};

CustomerLogin.propTypes = {
  customerLogin: PropTypes.func.isRequired,
};

const mapStateToProps = state => ({});

const mapDispatchToProps = {
  customerLogin,
};

export default connect(mapStateToProps, mapDispatchToProps)(CustomerLogin);
