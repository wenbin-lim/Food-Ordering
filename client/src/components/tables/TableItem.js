import React, { useState, Fragment } from 'react';
import PropTypes from 'prop-types';
import { connect } from 'react-redux';
import { useNavigate, matchPath, useLocation } from 'react-router-dom';

// Components
import ListItem from '../layout/ListItem';
import AlertDialog from '../layout/AlertDialog';

// Actions
import { deleteTable } from '../../actions/tables';

const TableItem = ({ index, table, deleteTable }) => {
  const { _id: tableId, name } = table;

  let actions = [
    {
      name: 'View',
      path: `${tableId}`,
    },
    {
      name: 'Edit',
      path: `${tableId}/edit`,
    },
    {
      name: 'Delete',
      callback: () => setShowDeleteTableAlert(true),
    },
  ];

  const [showDeleteTableAlert, setShowDeleteTableAlert] = useState(false);

  const navigate = useNavigate();
  const location = useLocation();

  const onTableDelete = async () => {
    const deleteTableSuccess = await deleteTable(tableId);

    let match = matchPath(
      {
        path: `/:companyName/tables/${tableId}`,
        end: false,
      },
      location.pathname
    );

    return deleteTableSuccess && match && navigate('', { replace: true });
  };

  return (
    <Fragment>
      <ListItem
        beforeListContent={<h2 className='list-index'>{index}</h2>}
        listContent={
          <Fragment>
            <p className='body-1'>{name ? name : 'No name defined'}</p>
          </Fragment>
        }
        actions={actions}
      />
      {showDeleteTableAlert && (
        <AlertDialog
          title={'Delete table?'}
          text={'Action cannot be undone'}
          action={{
            name: 'delete',
            type: 'error',
            callback: onTableDelete,
          }}
          unmountAlertDialogHandler={() => setShowDeleteTableAlert(false)}
        />
      )}
    </Fragment>
  );
};

TableItem.propTypes = {
  index: PropTypes.number,
  table: PropTypes.object.isRequired,
  deleteTable: PropTypes.func.isRequired,
};

const mapStateToProps = state => ({});

const mapDispatchToProps = {
  deleteTable,
};

export default connect(mapStateToProps, mapDispatchToProps)(TableItem);
