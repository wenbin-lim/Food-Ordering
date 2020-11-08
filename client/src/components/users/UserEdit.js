import React, { useEffect, useState, Fragment } from 'react';
import PropTypes from 'prop-types';
import { connect } from 'react-redux';
import { useParams, useNavigate } from 'react-router-dom';

// Actions
import { getUser, editUser } from '../../actions/users';

// Components
import SideSheet from '../layout/SideSheet';
import Spinner from '../layout/Spinner';
import TextInput from '../layout/TextInput';
import RadioInput from '../layout/RadioInput';
import CheckboxInput from '../layout/CheckboxInput';
import Button from '../layout/Button';
import AlertDialog from '../layout/AlertDialog';

// Icons
import ArrowIcon from '../icons/ArrowIcon';

// Custom Hooks
import useInputError from '../../hooks/useInputError';

const UserEdit = ({
  userAccess,
  users: { requesting, user, errors },
  getUser,
  editUser,
}) => {
  let { id } = useParams();

  useEffect(() => {
    getUser(id);

    // eslint-disable-next-line
  }, [id]);

  const [inputErrorMessages] = useInputError(
    {
      username: '',
      password: '',
      name: '',
      access: '',
      role: '',
    },
    errors
  );

  const [formData, setFormData] = useState({
    username: '',
    password: '',
    name: '',
    access: '2',
    role: [],
  });

  const { username, password, name, access, role } = formData;

  useEffect(() => {
    const { _id: userId, name, username, access, role } = { ...user };

    if (userId === id) {
      setFormData({
        username: username ? username : '',
        password: '',
        name: name ? name : '',
        access: typeof access === 'number' ? access.toString() : '2',
        role: Array.isArray(role) ? role : [],
      });
    }
  }, [user, id]);

  const onChange = ({ name, value }) =>
    setFormData({ ...formData, [name]: value });

  const [showChangePasswordAlert, setShowChangePasswordAlert] = useState(false);

  const checkIfChangePassword = e => {
    e.preventDefault();

    return formData.password ? setShowChangePasswordAlert(true) : onSubmit();
  };

  const navigate = useNavigate();

  const onSubmit = async () => {
    setShowChangePasswordAlert(false);

    let newUser = formData;

    if (userAccess < 99) {
      newUser = {
        ...formData,
        access: formData.role.indexOf('admin') >= 0 ? 3 : 2,
      };
    }

    const editUserSuccess = await editUser(id, newUser);

    return editUserSuccess && navigate('../');
  };

  const closeSideSheet = () => navigate('../../');

  const sideSheetContent = (
    <form id='userEditForm' onSubmit={checkIfChangePassword}>
      <div className='row'>
        <div className='col'>
          <TextInput
            label={'username'}
            required={true}
            name={'username'}
            type={'text'}
            value={username}
            onChangeHandler={onChange}
            error={inputErrorMessages.username}
          />
        </div>
      </div>

      <div className='row'>
        <div className='col'>
          <TextInput
            label={'password'}
            required={true}
            name={'password'}
            type={'password'}
            value={password}
            onChangeHandler={onChange}
            error={inputErrorMessages.password}
          />
        </div>
      </div>

      <div className='row'>
        <div className='col'>
          <TextInput
            label={'name'}
            required={true}
            name={'name'}
            type={'text'}
            value={name}
            onChangeHandler={onChange}
            error={inputErrorMessages.name}
          />
        </div>
      </div>

      {userAccess === 99 && (
        <div className='row'>
          <div className='col'>
            <RadioInput
              label={'access'}
              required={true}
              inline={true}
              name={'access'}
              inputs={[
                {
                  key: 'Staff',
                  value: '2',
                },
                {
                  key: 'Admin',
                  value: '3',
                },
                {
                  key: 'Wawaya Master',
                  value: '99',
                },
              ]}
              value={access}
              onChangeHandler={onChange}
              error={inputErrorMessages.access}
            />
          </div>
        </div>
      )}

      <div className='row'>
        <div className='col'>
          <CheckboxInput
            label={'role'}
            required={true}
            name={'role'}
            inline={true}
            inputs={[
              {
                key: 'Waiter',
                value: 'waiter',
              },
              {
                key: 'Cashier',
                value: 'cashier',
              },
              {
                key: 'Kitchen',
                value: 'kitchen',
              },
              {
                key: 'Admin',
                value: 'admin',
              },
            ]}
            value={role}
            onChangeHandler={onChange}
            error={inputErrorMessages.role}
          />
        </div>
      </div>
    </form>
  );

  return (
    <Fragment>
      <SideSheet
        wrapper={false}
        headerTitle={'Edit User'}
        closeSideSheetHandler={closeSideSheet}
        content={user && user._id !== id ? <Spinner /> : sideSheetContent}
        footerBtn={
          <Button
            fill={'contained'}
            type={'primary'}
            block={true}
            blockBtnBottom={true}
            text={'edit'}
            icon={
              requesting ? (
                <Spinner height={'1.5rem'} />
              ) : (
                <ArrowIcon direction='right' />
              )
            }
            disabled={requesting}
            submit={true}
            form={'userEditForm'}
          />
        }
      />
      {showChangePasswordAlert && (
        <AlertDialog
          title={'Change password?'}
          action={{
            name: 'Continue',
            type: 'error',
            callback: onSubmit,
          }}
          unmountAlertDialogHandler={() => setShowChangePasswordAlert(false)}
        />
      )}
    </Fragment>
  );
};

UserEdit.propTypes = {
  userAccess: PropTypes.number.isRequired,
  users: PropTypes.object.isRequired,
  getUser: PropTypes.func.isRequired,
  editUser: PropTypes.func.isRequired,
};

const mapStateToProps = state => ({
  users: state.users,
});

const mapDispatchToProps = {
  getUser,
  editUser,
};

export default connect(mapStateToProps, mapDispatchToProps)(UserEdit);
