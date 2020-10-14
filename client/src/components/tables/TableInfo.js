import React, { useEffect, Fragment } from 'react';
import PropTypes from 'prop-types';
import { connect } from 'react-redux';
import { useParams } from 'react-router-dom';

import Moment from 'react-moment';

// Actions
import { getTable } from '../../actions/tables';

// Components
import Header from '../layout/Header';

/*
  =====
  Props
  =====
  @name       getTable
  @type       function
  @desc       redux action to retrieve table info for database
  @required   true

  @name       tables
  @type       object
  @desc       app level tables state
  @required   true
*/

const TableInfo = ({ getTable, tables: { table } }) => {
  let { id } = useParams();

  useEffect(() => {
    getTable(id);
  }, [id]);

  return (
    <div
      style={{
        height: '100%',
        display: 'grid',
        gridTemplateRows: 'auto 1fr auto',
      }}
    >
      <Header title={'Table Info'} closeActionCallback={'../'} />

      <div>
        {table && (
          <div style={{ padding: '1rem' }}>
            {table.name && (
              <Fragment>
                <p className='caption'>Name</p>
                <p style={{ marginBottom: '1rem' }}>{table.name}</p>
              </Fragment>
            )}

            {table.creationDate && (
              <Fragment>
                <p className='caption'>Created at</p>
                <Moment format='DD-MM-YYYY'>{table.creationDate}</Moment>
              </Fragment>
            )}

            <p></p>
          </div>
        )}
      </div>
    </div>
  );
};

TableInfo.propTypes = {
  getTable: PropTypes.func.isRequired,
  tables: PropTypes.object.isRequired,
};

const mapStateToProps = state => ({
  tables: state.tables,
});

const mapDispatchToProps = { getTable };

export default connect(mapStateToProps, mapDispatchToProps)(TableInfo);
