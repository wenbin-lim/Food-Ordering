import React, { useState, Fragment } from 'react';
import PropTypes from 'prop-types';
import { connect } from 'react-redux';

import Moment from 'react-moment';
import 'moment-timezone';

// Components
import ListItem from '../layout/ListItem';
import Dialog from '../layout/Dialog';
import Button from '../layout/Button';

// Icons
import AvatarIcon from '../icons/AvatarIcon';

// Actions
import { deleteTable } from '../../actions/tables';

/*
  =====
  Props
  =====
  @name       table
  @type       object
  @desc       table object from Parent
  @required   true

  @name       deleteTable
  @type       function
  @desc       Redux action from tables to delete table from app level tables state and DB
  @required   true
*/
const TableItem = ({ table, deleteTable }) => {
  // destructure table obj
  const { _id: tableId, name, creationDate } = table;

  // Populate list item actions
  let listItemAction = [
    {
      name: 'View',
      link: `${tableId}`,
    },
    {
      name: 'Edit',
      link: `${tableId}/edit`,
    },
    {
      name: 'Delete',
      callback: () => setShowDeleteTableAlert(true),
    },
  ];

  const [showDeleteTableAlert, setShowDeleteTableAlert] = useState(false);

  return (
    <Fragment>
      <ListItem
        beforeListContent={<AvatarIcon />}
        listContent={
          <Fragment>
            <p
              className='body-1'
              style={{ display: 'flex', alignItems: 'center' }}
            >
              {name}
              {table.role &&
                table.role.map((role, index) => (
                  <span
                    key={`table-${tableId}-role-${index}`}
                    className='badge badge-small badge-secondary'
                    style={{ marginLeft: '0.5rem' }}
                  >
                    {role}
                  </span>
                ))}
            </p>
            <p className='body-2'>
              Created at{' '}
              <Moment local format='DD/MM HH:mm:ss'>
                {creationDate}
              </Moment>
            </p>
          </Fragment>
        }
        actions={listItemAction}
      />
      {showDeleteTableAlert && (
        <Dialog
          content={
            <h2 className='heading-2 text-center' style={{ padding: '3rem 0' }}>
              Delete table?
            </h2>
          }
          footer={
            <div
              style={{
                display: 'flex',
                justifyContent: 'space-evenly',
              }}
            >
              <Button
                btnStyle={'contained'}
                type={'error'}
                text={'delete'}
                additionalStyles={{ flex: '1', marginRight: '1rem' }}
                onClick={() => deleteTable(tableId)}
              />
              <Button
                btnStyle={'outline'}
                type={'background'}
                text={'Cancel'}
                additionalStyles={{ flex: '1', marginLeft: '1rem' }}
                onClick={() => setShowDeleteTableAlert(false)}
              />
            </div>
          }
          closeDialogHandler={() => setShowDeleteTableAlert(false)}
        />
      )}
    </Fragment>
  );
};

TableItem.propTypes = {
  table: PropTypes.object.isRequired,
  deleteTable: PropTypes.func.isRequired,
};

const mapStateToProps = state => ({});

const mapDispatchToProps = {
  deleteTable,
};

export default connect(mapStateToProps, mapDispatchToProps)(TableItem);
