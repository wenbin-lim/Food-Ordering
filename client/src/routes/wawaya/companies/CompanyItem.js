import React, { useState, Fragment } from 'react';
import PropTypes from 'prop-types';
import { useDispatch } from 'react-redux';
import { useNavigate, matchPath, useLocation } from 'react-router-dom';

import Moment from 'react-moment';

// Actions
import { setSnackbar } from '../../../actions/app';

// Components
import ListItem, { Action } from '../../../components/layout/ListItem';
import AlertDialog from '../../../components/layout/AlertDialog';

// Custom Hooks
import useErrors from '../../../hooks/useErrors';
import useDelete from '../../../query/hooks/useDelete';

const CompanyItem = ({ index, data, onClick }) => {
  const navigate = useNavigate();
  const location = useLocation();
  const dispatch = useDispatch();

  const { _id: companyId, name, displayedName, creationDate } = { ...data };

  const [deleteCompany, { error }] = useDelete('companies', {
    route: `/api/companies/${companyId}`,
  });
  useErrors(error);

  const [showDeleteCompanyAlert, setShowDeleteCompanyAlert] = useState(false);

  const onCompanyDelete = async () => {
    const deleteCompanySuccess = await deleteCompany();

    deleteCompanySuccess &&
      dispatch(
        setSnackbar(`Deleted company of name '${displayedName}'`, 'success')
      );

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
      <ListItem>
        <ListItem.Before>
          <h2 className='list-index'>{index}</h2>
        </ListItem.Before>
        <ListItem.Content
          onClick={() => typeof onClick === 'function' && onClick(companyId)}
        >
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
        </ListItem.Content>
        {!onClick && (
          <ListItem.Actions>
            <Action name='View' onClick={() => navigate(companyId)} />
            <Action name='Edit' onClick={() => navigate(`${companyId}/edit`)} />
            {name !== 'wawaya' && (
              <Action
                name='Delete'
                onClick={() => setShowDeleteCompanyAlert(true)}
              />
            )}
          </ListItem.Actions>
        )}
      </ListItem>
      {showDeleteCompanyAlert && (
        <AlertDialog
          title={'Delete Company?'}
          text={'Action cannot be undone'}
          action={{
            name: 'delete',
            type: 'error',
            callback: onCompanyDelete,
          }}
          onCloseAlertDialog={() => setShowDeleteCompanyAlert(false)}
        />
      )}
    </Fragment>
  );
};

CompanyItem.propTypes = {
  index: PropTypes.number,
  data: PropTypes.object,
  onClick: PropTypes.func,
};

export default CompanyItem;
