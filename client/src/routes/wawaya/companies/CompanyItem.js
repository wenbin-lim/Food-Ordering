import React, { useState, Fragment } from 'react';
import PropTypes from 'prop-types';
import { connect } from 'react-redux';

import Moment from 'react-moment';
import 'moment-timezone';

// Components
import ListItem from '../../../components/layout/ListItem';
import Dialog from '../../../components/layout/Dialog';
import Button from '../../../components/layout/Button';

// Actions
import { deleteCompany } from '../../../actions/companies';

/* 
  =====
  Props
  =====
  @name       index
  @type       number
  @desc       index for list
  @required   true

  @name       company
  @type       object
  @desc       company object from Parent
  @required   true

  @name       deleteCompany
  @type       function
  @desc       redux action to delete company by id
  @required   true
*/
const CompanyItem = ({ index, company, deleteCompany }) => {
  // destructure company obj
  const { _id: companyId, name, displayedName } = company;

  // Populate list item actions
  let listItemAction = [
    {
      name: 'View',
      link: `${companyId}`,
    },
    {
      name: 'Edit',
      link: `${companyId}/edit`,
    },
  ];

  if (name !== 'wawaya') {
    listItemAction = [
      ...listItemAction,
      {
        name: 'Delete',
        callback: () => setShowDeleteUserAlert(true),
      },
    ];
  }

  const [showDeleteUserAlert, setShowDeleteUserAlert] = useState(false);

  return (
    <Fragment>
      <ListItem
        beforeListContent={<h2 className='heading-2'>{index}</h2>}
        listContent={
          <Fragment>
            <p className='body-1'>{displayedName}</p>
            {company.creationDate && (
              <p className='body-2'>
                Created at{' '}
                <Moment local format='DD/MM HH:mm:ss'>
                  {company.creationDate}
                </Moment>
              </p>
            )}
          </Fragment>
        }
        actions={listItemAction}
      />
      {showDeleteUserAlert && (
        <Dialog
          content={
            <h2 className='heading-2 text-center' style={{ padding: '3rem 0' }}>
              Delete company?
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
                onClick={() => deleteCompany(companyId)}
              />
              <Button
                btnStyle={'outline'}
                type={'background'}
                text={'Cancel'}
                additionalStyles={{ flex: '1', marginLeft: '1rem' }}
                onClick={() => setShowDeleteUserAlert(false)}
              />
            </div>
          }
          closeDialogHandler={() => setShowDeleteUserAlert(false)}
        />
      )}
    </Fragment>
  );
};

CompanyItem.propTypes = {
  index: PropTypes.number,
  company: PropTypes.object.isRequired,
  deleteCompany: PropTypes.func.isRequired,
};

const mapStateToProps = state => ({});

const mapDispatchToProps = {
  deleteCompany,
};

export default connect(mapStateToProps, mapDispatchToProps)(CompanyItem);
