import React, { useState, Fragment } from 'react';
import PropTypes from 'prop-types';
import { connect } from 'react-redux';
import { useNavigate, matchPath, useLocation } from 'react-router-dom';

// Components
import ListItem from '../layout/ListItem';
import AlertDialog from '../layout/AlertDialog';

// Actions
import { deleteMenu } from '../../actions/menus';

const MenuItem = ({ menu, deleteMenu }) => {
  const { _id: menuId, name, index, availability } = menu;

  let actions = [
    {
      name: 'View',
      path: `${menuId}`,
    },
    {
      name: 'Edit',
      path: `${menuId}/edit`,
    },
    {
      name: 'Delete',
      callback: () => setShowDeleteMenuAlert(true),
    },
  ];

  const [showDeleteMenuAlert, setShowDeleteMenuAlert] = useState(false);

  const navigate = useNavigate();
  const location = useLocation();

  const onMenuDelete = async () => {
    const deleteMenuSuccess = await deleteMenu(menuId);

    let match = matchPath(
      {
        path: `/:companyName/menus/${menuId}`,
        end: false,
      },
      location.pathname
    );

    return deleteMenuSuccess && match && navigate('', { replace: true });
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
      {showDeleteMenuAlert && (
        <AlertDialog
          title={'Delete menu?'}
          text={'Action cannot be undone'}
          action={{
            name: 'delete',
            type: 'error',
            callback: onMenuDelete,
          }}
          unmountAlertDialogHandler={() => setShowDeleteMenuAlert(false)}
        />
      )}
    </Fragment>
  );
};

MenuItem.propTypes = {
  menu: PropTypes.object.isRequired,
  deleteMenu: PropTypes.func.isRequired,
};

const mapStateToProps = state => ({});

const mapDispatchToProps = {
  deleteMenu,
};

export default connect(mapStateToProps, mapDispatchToProps)(MenuItem);
