import React, { useState } from 'react';
import PropTypes from 'prop-types';
import { connect } from 'react-redux';
import { useNavigate } from 'react-router-dom';

// Actions
import { addUser } from '../../actions/users';
import { setSnackbar } from '../../actions/app';

// Components
import SideSheet from '../layout/SideSheet';
import Spinner from '../layout/Spinner';
import TextInput from '../layout/TextInput';
import RadioInput from '../layout/RadioInput';
import CheckboxInput from '../layout/CheckboxInput';
import Button from '../layout/Button';

// Icons
import ArrowIcon from '../icons/ArrowIcon';

// Custom Hooks
import useInputError from '../../hooks/useInputError';

const UserAdd = ({
  userAccess,
  userCompanyId,
  companies: { company },
  users: { requesting, errors },
  addUser,
  setSnackbar,
}) => {
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

  const onChange = ({ name, value }) =>
    setFormData({ ...formData, [name]: value });

  const navigate = useNavigate();

  const onSubmit = async e => {
    e.preventDefault();

    if (userAccess === 99 && !company)
      return setSnackbar('Select a company first!', 'error');

    let companyId = company && userAccess === 99 ? company._id : userCompanyId;

    let newUser = formData;

    if (userAccess < 99) {
      newUser = {
        ...formData,
        access: formData.role.indexOf('admin') >= 0 ? 3 : 2,
      };
    }

    const addUserSuccess = await addUser(companyId, newUser);

    return addUserSuccess && closeSideSheet();
  };

  const closeSideSheet = () => navigate('../');

  const sideSheetContent = (
    <form id='userAddForm' onSubmit={onSubmit}>
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
    <SideSheet
      wrapper={false}
      headerTitle={'Add User'}
      closeSideSheetHandler={closeSideSheet}
      content={sideSheetContent}
      footerBtn={
        <Button
          fill={'contained'}
          type={'primary'}
          block={true}
          blockBtnBottom={true}
          text={'add'}
          icon={
            requesting ? (
              <Spinner height={'1.5rem'} />
            ) : (
              <ArrowIcon direction='right' />
            )
          }
          disabled={requesting}
          submit={true}
          form={'userAddForm'}
        />
      }
    />
  );
};

UserAdd.propTypes = {
  userAccess: PropTypes.number.isRequired,
  userCompanyId: PropTypes.string.isRequired,
  companies: PropTypes.object.isRequired,
  users: PropTypes.object.isRequired,
  addUser: PropTypes.func.isRequired,
  setSnackbar: PropTypes.func.isRequired,
};

const mapStateToProps = state => ({
  users: state.users,
  companies: state.companies,
});

const mapDispatchToProps = {
  addUser,
  setSnackbar,
};

export default connect(mapStateToProps, mapDispatchToProps)(UserAdd);
