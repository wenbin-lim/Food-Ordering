import React, { useState, useEffect, useRef } from 'react';
import PropTypes from 'prop-types';
import { connect } from 'react-redux';
import { useSearchParams, Navigate, Link } from 'react-router-dom';

// Components
import Spinner from '../../components/layout/Spinner';

// Actions
import { tableLogin } from '../../actions/auth';

/* 
  =====
  Props
  =====
  @name       auth 
  @type       object
  @desc       app level auth state
  @required   true
*/
export const CustomerTakeaway = ({
  auth: { loading, access, auth },
  tableLogin,
}) => {
  let [searchParams] = useSearchParams();

  const [tableLoginLoading, setTableLoginLoading] = useState(true);

  useEffect(() => {
    /* Functions to run on mount */
    if (searchParams.has('company') && searchParams.has('table')) {
      // customer access this route through the QR code
      // log in customer to table and navigate to QR Code Landing page
      tableLogin(searchParams.get('company'), searchParams.get('table'));
    }

    // eslint-disable-next-line
  }, []);

  useEffect(() => {
    // block with tableLoginLoading first since loading from auth state is initially false
    // once tableLogin function is called, loading will be set to true
    // thus remove the tableLoginLoading blocking
    if (loading) {
      setTableLoginLoading(false);
    }
  }, [loading]);

  if (searchParams.has('company') && searchParams.has('table')) {
    if (tableLoginLoading || loading) {
      return <Spinner />;
    } else {
      if (auth && access > 0) {
        return <Navigate to={'table'} replace={true} />;
      }
    }
  }

  return (
    <div>
      company CustomerTakeaway page
      <Link to={`table`}>table</Link>
      <Link to={`table/menu`}>menu</Link>
    </div>
  );
};

CustomerTakeaway.propTypes = {
  auth: PropTypes.object.isRequired,
  tableLogin: PropTypes.func.isRequired,
};

const mapStateToProps = state => ({});

const mapDispatchToProps = {
  tableLogin,
};

export default connect(mapStateToProps, mapDispatchToProps)(CustomerTakeaway);
