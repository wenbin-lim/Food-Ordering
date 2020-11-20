import React, { useEffect, useState } from 'react';
import PropTypes from 'prop-types';
import { useDispatch } from 'react-redux';
import { useNavigate, useParams } from 'react-router-dom';

// Actions
import { setSnackbar } from '../../actions/app';

// Components
import SideSheet from '../layout/SideSheet';
import TextInput from '../layout/TextInput';
import RadioInput from '../layout/RadioInput';
import CheckboxInput from '../layout/CheckboxInput';
import AlertDialog from '../layout/AlertDialog';

// Custom Hooks
import useErrors from '../../hooks/useErrors';
import useGetOne from '../../query/hooks/useGetOne';
import usePut from '../../query/hooks/usePut';

const UserEdit = ({ user: { access: userAccess } }) => {
  let { id } = useParams();
  const navigate = useNavigate();
  const dispatch = useDispatch();

  const { data: user, isLoading, error } = useGetOne('user', id, {
    route: `/api/users/${id}`,
  });
  useErrors(error);

  const [
    editUser,
    { isLoading: requesting, error: editErrors },
  ] = usePut('users', { route: `/api/users/${id}` });
  const [inputErrors] = useErrors(editErrors, ['username', 'password', 'name']);

  const [formData, setFormData] = useState({
    username: '',
    password: '',
    name: '',
    access: '2',
    role: [],
  });

  const { username, password, name, access, role } = formData;

  useEffect(() => {
    if (user) {
      const { name, username, access, role } = user;

      setFormData({
        username: username ? username : '',
        password: '',
        name: name ? name : '',
        access: typeof access === 'number' ? access.toString() : '2',
        role: Array.isArray(role) ? role : [],
      });
    }
  }, [isLoading, user]);

  const onChange = ({ name, value }) =>
    setFormData({ ...formData, [name]: value });

  const [showChangePasswordAlert, setShowChangePasswordAlert] = useState(false);

  const checkIfChangePassword = async e => {
    e.preventDefault();

    return password ? setShowChangePasswordAlert(true) : onSubmit();
  };

  const onSubmit = async () => {
    setShowChangePasswordAlert(false);

    let newAccess =
      userAccess < 99 ? (role.indexOf('admin') >= 0 ? 3 : 2) : access;

    const editUserSuccess = await editUser({
      ...formData,
      access: newAccess,
    });

    return (
      editUserSuccess &&
      dispatch(setSnackbar(`Edited user of name '${name}'`, 'success'))
    );
  };

  const closeSideSheet = () => navigate('../../');

  return (
    <SideSheet wrapper={false}>
      <SideSheet.Header title={'Edit User'} closeHandler={closeSideSheet} />
      <SideSheet.Content
        elementType={'form'}
        id={'userEditForm'}
        onSubmit={checkIfChangePassword}
      >
        <TextInput
          label={'username'}
          required={true}
          name={'username'}
          type={'text'}
          value={username}
          onChangeHandler={onChange}
          error={inputErrors.username}
        />

        <TextInput
          label={'password'}
          required={true}
          name={'password'}
          type={'password'}
          value={password}
          onChangeHandler={onChange}
          error={inputErrors.password}
        />

        <TextInput
          label={'name'}
          required={true}
          name={'name'}
          type={'text'}
          value={name}
          onChangeHandler={onChange}
          error={inputErrors.name}
        />

        {userAccess === 99 && (
          <RadioInput
            label={'access'}
            required={true}
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
          />
        )}

        <CheckboxInput
          label={'role'}
          required={true}
          name={'role'}
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
      </SideSheet.Content>
      <SideSheet.FooterButton
        text={'edit'}
        requesting={requesting}
        form={'userEditForm'}
      />
    </SideSheet>
  );
};

UserEdit.propTypes = {
  user: PropTypes.object,
};

export default UserEdit;
