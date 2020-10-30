import React, { useEffect, Fragment } from 'react';
import PropTypes from 'prop-types';
import { connect } from 'react-redux';
import { useParams, useNavigate } from 'react-router-dom';

import Moment from 'react-moment';

// Actions
import { getTable } from '../../actions/tables';

// Components
import SideSheet from '../layout/SideSheet';
import Spinner from '../layout/Spinner';

const TableInfo = ({ tables: { requesting, table }, getTable }) => {
  let { id } = useParams();
  const navigate = useNavigate();

  useEffect(() => {
    getTable(id);

    // eslint-disable-next-line
  }, [id]);

  const { _id: tableId, name, creationDate } = {
    ...table,
  };

  const closeSideSheet = () => navigate('../');

  const sideSheetContent =
    requesting || tableId !== id ? (
      <Spinner />
    ) : (
      <Fragment>
        {name && (
          <div className='row'>
            <div className='col'>
              <p className='caption'>name</p>
              <p className='body-1'>{name}</p>
            </div>
          </div>
        )}

        {creationDate && (
          <div className='row'>
            <div className='col'>
              <p className='caption'>Created at</p>
              <Moment format='DD-MM-YYYY'>{creationDate}</Moment>
            </div>
          </div>
        )}
      </Fragment>
    );

  return (
    <SideSheet
      wrapper={false}
      headerTitle={!requesting || tableId === id ? name : null}
      closeSideSheetHandler={closeSideSheet}
      content={sideSheetContent}
    />
  );
};

TableInfo.propTypes = {
  tables: PropTypes.object.isRequired,
  getTable: PropTypes.func.isRequired,
};

const mapStateToProps = state => ({
  tables: state.tables,
});

const mapDispatchToProps = { getTable };

export default connect(mapStateToProps, mapDispatchToProps)(TableInfo);
