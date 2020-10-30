import React, { useState, Fragment } from 'react';
import PropTypes from 'prop-types';
import { connect } from 'react-redux';
import { useNavigate, matchPath, useLocation } from 'react-router-dom';

import Moment from 'react-moment';

// Components
import ListItem from '../../../components/layout/ListItem';
import AlertDialog from '../../../components/layout/AlertDialog';

// Actions
import { deleteCompany } from '../../../actions/companies';

const CompanyItem = ({ index, company, onClick, deleteCompany }) => {
  const { _id: companyId, name, displayedName, creationDate } = { ...company };

  let actions = [
    {
      name: 'View',
      path: `${companyId}`,
    },
    {
      name: 'Edit',
      path: `${companyId}/edit`,
    },
  ];

  name !== 'wawaya' &&
    actions.push({
      name: 'Delete',
      callback: () => setShowDeleteCompanyAlert(true),
    });

  const [showDeleteCompanyAlert, setShowDeleteCompanyAlert] = useState(false);

  const navigate = useNavigate();
  const location = useLocation();

  const onCompanyDelete = async () => {
    const deleteCompanySuccess = await deleteCompany(companyId);

    let match = matchPath(
      {
        path: `/:companyName/companies/${companyId}`,
        end: false,
      },
      location.pathname
    );

    return deleteCompanySuccess && match && navigate('', { replace: true });
  };

  return (
    <Fragment>
      <ListItem
        beforeListContent={<h2 className='list-index'>{index}</h2>}
        listContent={
          <Fragment>
            <p className='body-1'>
              <b>{displayedName ? displayedName : 'No name defined'}</b>
            </p>
            {creationDate && (
              <p className='body-2'>
                Created at{' '}
                <Moment local format='DD/MM/YY'>
                  {creationDate}
                </Moment>
              </p>
            )}
          </Fragment>
        }
        actions={!onClick ? actions : null}
        onClick={onClick}
      />
      {showDeleteCompanyAlert && (
        <AlertDialog
          title={'Delete Company?'}
          text={'Action cannot be undone'}
          action={{
            name: 'delete',
            type: 'error',
            callback: onCompanyDelete,
          }}
          unmountAlertDialogHandler={() => setShowDeleteCompanyAlert(false)}
        />
      )}
    </Fragment>
  );
};

CompanyItem.propTypes = {
  index: PropTypes.number,
  company: PropTypes.object.isRequired,
  onClick: PropTypes.func,
  deleteCompany: PropTypes.func.isRequired,
};

const mapStateToProps = state => ({});

const mapDispatchToProps = {
  deleteCompany,
};

export default connect(mapStateToProps, mapDispatchToProps)(CompanyItem);
