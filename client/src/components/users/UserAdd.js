import React, { useState } from 'react';
import PropTypes from 'prop-types';
import { useDispatch } from 'react-redux';
import { useNavigate } from 'react-router-dom';
import { queryCache } from 'react-query';

// Actions
import { setSnackbar } from '../../actions/app';

// Components
import SideSheet from '../layout/SideSheet';
import TextInput from '../layout/TextInput';
import RadioInput from '../layout/RadioInput';
import CheckboxInput from '../layout/CheckboxInput';
import Dropdown from '../layout/Dropdown';

// Custom Hooks
import useErrors from '../../hooks/useErrors';
import usePost from '../../query/hooks/usePost';

const UserAdd = ({ user: { access: userAccess }, company: userCompanyId }) => {
  const navigate = useNavigate();
  const dispatch = useDispatch();

  const companies = queryCache.getQueryData('companies');

  const [addUser, { isLoading: requesting, error }] = usePost('users', {
    route: '/api/users',
  });
  const [inputErrors] = useErrors(error, ['username', 'password', 'name']);

  const [formData, setFormData] = useState({
    company: userCompanyId,
    username: '',
    password: '',
    name: '',
    access: '2',
    role: [],
  });

  const { company, username, password, name, access, role } = formData;

  const onChange = ({ name, value }) =>
    setFormData({ ...formData, [name]: value });

  const onSubmit = async e => {
    e.preventDefault();

    let newAccess =
      userAccess < 99 ? (role.indexOf('admin') >= 0 ? 3 : 2) : access;

    const addUserSuccess = await addUser({
      ...formData,
      access: newAccess,
    });

    return (
      addUserSuccess &&
      dispatch(setSnackbar(`Added user of name '${name}'`, 'success'))
    );
  };

  return (
    <SideSheet wrapper={false}>
      <SideSheet.Header
        title={'Add User'}
        closeHandler={() => navigate('../')}
      />
      <SideSheet.Content
        elementType={'form'}
        id={'userAddForm'}
        onSubmit={onSubmit}
      >
        {userAccess === 99 && Array.isArray(companies) && (
          <Dropdown
            required={true}
            label={'Company'}
            name={'company'}
            options={companies.map(({ _id, displayedName }) => ({
              key: displayedName,
              value: _id,
            }))}
            value={company}
            onChangeHandler={onChange}
          />
        )}

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
      </SideSheet.Content>
      <SideSheet.FooterButton
        text={'add'}
        requesting={requesting}
        form={'userAddForm'}
      />
    </SideSheet>
  );
};

UserAdd.propTypes = {
  user: PropTypes.object,
  company: PropTypes.string,
};

export default UserAdd;
