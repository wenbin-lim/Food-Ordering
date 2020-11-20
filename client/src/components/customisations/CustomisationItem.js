import React, { useState, Fragment } from 'react';
import PropTypes from 'prop-types';
import { useDispatch } from 'react-redux';
import { useNavigate, matchPath, useLocation } from 'react-router-dom';

// Actions
import { setSnackbar } from '../../actions/app';

// Components
import ListItem, { Action } from '../layout/ListItem';
import AlertDialog from '../layout/AlertDialog';

// Custom Hooks
import useErrors from '../../hooks/useErrors';
import useDelete from '../../query/hooks/useDelete';

const CustomisationItem = ({ index, data }) => {
  const navigate = useNavigate();
  const location = useLocation();
  const dispatch = useDispatch();

  const { _id: customisationId, name, availability } = { ...data };

  const [deleteCustomisation, { error }] = useDelete('customisations', {
    route: `/api/customisations/${customisationId}`,
  });
  useErrors(error);

  const [
    showDeleteCustomisationAlert,
    setShowDeleteCustomisationAlert,
  ] = useState(false);

  const onCustomisationDelete = async () => {
    const deleteCustomisationSuccess = await deleteCustomisation();

    deleteCustomisationSuccess &&
      dispatch(
        setSnackbar(`Deleted customisation of name '${name}'`, 'success')
      );

    let match = matchPath(
      {
        path: `/:companyName/customisations/${customisationId}`,
        end: false,
      },
      location.pathname
    );

    return (
      deleteCustomisationSuccess && match && navigate('', { replace: true })
    );
  };

  return (
    <Fragment>
      <ListItem>
        <ListItem.Before>
          <h2 className='list-index'>{index}</h2>
        </ListItem.Before>
        <ListItem.Content>
          <p className='body-1'>{name ? name : 'No name defined'}</p>
          {availability === false && (
            <span className='badge badge-small badge-error'>Unavailable</span>
          )}
        </ListItem.Content>
        <ListItem.Actions>
          <Action name='View' onClick={() => navigate(customisationId)} />
          <Action
            name='Edit'
            onClick={() => navigate(`${customisationId}/edit`)}
          />
          <Action
            name='Delete'
            onClick={() => setShowDeleteCustomisationAlert(true)}
          />
        </ListItem.Actions>
      </ListItem>

      {showDeleteCustomisationAlert && (
        <AlertDialog
          title={'Delete customisation?'}
          text={'Action cannot be undone'}
          action={{
            name: 'delete',
            type: 'error',
            callback: onCustomisationDelete,
          }}
          onCloseAlertDialog={() => setShowDeleteCustomisationAlert(false)}
        />
      )}
    </Fragment>
  );
};

CustomisationItem.propTypes = {
  index: PropTypes.number,
  data: PropTypes.object,
};

export default CustomisationItem;
