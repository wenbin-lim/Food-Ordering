import React, { useState, useEffect } from 'react';
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
      CustomerTakeaway page
      <div style={{ display: 'flex' }}>
        <Link to={`table`} className='btn btn-outline btn-background'>
          link trying to access qr landing page
        </Link>
        <Link to={`table/menu`} className='btn btn-outline btn-background'>
          link trying to access table menu page
        </Link>
      </div>
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
