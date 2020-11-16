import React, { useEffect, useRef } from 'react';
import PropTypes from 'prop-types';
import { connect } from 'react-redux';
import { useSearchParams, Navigate, useNavigate } from 'react-router-dom';

// Components
import Spinner from '../../components/layout/Spinner';

// Actions
import { customerLogin } from '../../actions/auth';

const CustomerLogin = ({ auth: { loading, errors, user }, customerLogin }) => {
  let [searchParams] = useSearchParams();
  const companyId = searchParams.get('company');
  const tableId = searchParams.get('table');
  const navigate = useNavigate();

  const isFirstRun = useRef(true);

  useEffect(() => {
    if (isFirstRun.current) {
      isFirstRun.current = false;
      return;
    } else {
      // loading is true first
      // wait for LOAD_TOKEN to finish and will turn loading to false
      if (companyId && tableId) {
        customerLogin(companyId, tableId);
      } else {
        return navigate('/', { replace: true });
      }
    }

    // eslint-disable-next-line
  }, [loading]);

  if (errors) {
    const { status } = errors;

    switch (status) {
      case 400:
      case 404:
        return <Navigate to='/' replace={true} />;
      default:
        break;
    }
  }

  if (user) {
    // user may exist due to LOAD_TOKEN
    // but the loaded user might not be from customerLogin
    if (user._id === tableId && user.company?._id === companyId) {
      return <Navigate to={`/dinein/${user?.company?.name}`} />;
    }
  }

  return <Spinner fullscreen={true} />;
};

CustomerLogin.propTypes = {
  customerLogin: PropTypes.func.isRequired,
};

const mapStateToProps = state => ({
  auth: state.auth,
});

const mapDispatchToProps = {
  customerLogin,
};

export default connect(mapStateToProps, mapDispatchToProps)(CustomerLogin);
