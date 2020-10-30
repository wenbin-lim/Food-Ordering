import React, { useState, Fragment } from 'react';
import PropTypes from 'prop-types';
import { connect } from 'react-redux';
import { useNavigate, matchPath, useLocation } from 'react-router-dom';

// Components
import ListItem from '../layout/ListItem';
import AlertDialog from '../layout/AlertDialog';

// Actions
import { deleteCustomisation } from '../../actions/customisations';

const CustomisationItem = ({ index, customisation, deleteCustomisation }) => {
  const { _id: customisationId, name, availability } = customisation;

  let actions = [
    {
      name: 'View',
      path: `${customisationId}`,
    },
    {
      name: 'Edit',
      path: `${customisationId}/edit`,
    },
    {
      name: 'Delete',
      callback: () => setShowDeleteCustomisationAlert(true),
    },
  ];

  const [
    showDeleteCustomisationAlert,
    setShowDeleteCustomisationAlert,
  ] = useState(false);

  const navigate = useNavigate();
  const location = useLocation();

  const onCustomisationDelete = async () => {
    const deleteCustomisationSuccess = await deleteCustomisation(
      customisationId
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
      <ListItem
        beforeListContent={<h2 className='list-index'>{index}</h2>}
        listContent={
          <Fragment>
            <p className='body-1'>{name ? name : 'No name defined'}</p>
            {availability === false && (
              <span className='badge badge-error'>Unavailable</span>
            )}
          </Fragment>
        }
        actions={actions}
      />
      {showDeleteCustomisationAlert && (
        <AlertDialog
          title={'Delete customisation?'}
          text={'Action cannot be undone'}
          action={{
            name: 'delete',
            type: 'error',
            callback: onCustomisationDelete,
          }}
          unmountAlertDialogHandler={() =>
            setShowDeleteCustomisationAlert(false)
          }
        />
      )}
    </Fragment>
  );
};

CustomisationItem.propTypes = {
  index: PropTypes.number,
  customisation: PropTypes.object.isRequired,
  deleteCustomisation: PropTypes.func.isRequired,
};

const mapStateToProps = state => ({});

const mapDispatchToProps = {
  deleteCustomisation,
};

export default connect(mapStateToProps, mapDispatchToProps)(CustomisationItem);
