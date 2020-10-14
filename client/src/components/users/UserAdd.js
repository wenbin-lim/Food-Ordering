import React, { useState } from 'react';
import PropTypes from 'prop-types';
import { connect } from 'react-redux';
import { useNavigate } from 'react-router-dom';

// Actions
import { addUser } from '../../actions/users';

// Components
import Header from '../layout/Header';
import Spinner from '../layout/Spinner';
import TextInput from '../layout/TextInput';
import RadioInput from '../layout/RadioInput';
import CheckboxInput from '../layout/CheckboxInput';
import Button from '../layout/Button';

// Icons
import ArrowIcon from '../icons/ArrowIcon';

// Custom Hooks
import useInputError from '../../hooks/useInputError';

/* 
  =====
  Props
  =====
  @name       auth 
  @type       object
  @desc       app level auth state from Route
  @required   true

  @name       companies 
  @type       object
  @desc       app level companies state
  @required   true

  @name       users 
  @type       object
  @desc       app level users state
  @required   true

  @name       addUser 
  @type       function
  @desc       action to add new company to db
  @required   true
*/
const UserAdd = ({
  auth: { access: authAccess, company: authCompany },
  companies: { company },
  users: { userLoading, userErrors },
  addUser,
}) => {
  const initialInputErrorMessagesState = {
    username: '',
    password: '',
    name: '',
    access: '',
    role: '',
  };

  const [inputErrorMessages] = useInputError(
    initialInputErrorMessagesState,
    userErrors
  );

  // Component state to change input field values
  const [formData, setFormData] = useState({
    username: '',
    password: '',
    name: '',
    access: 2,
    role: [],
  });

  const { username, password, name, access, role } = formData;

  const onChange = ({ name, value }) => {
    setFormData({ ...formData, [name]: value });
  };

  const navigate = useNavigate();

  const onSubmit = async e => {
    e.preventDefault();

    let newUser = formData;
    let companyId = authCompany._id;

    if (authAccess === 99 && company) {
      companyId = company._id;
    } else if (authAccess >= 3) {
      newUser = {
        ...formData,
        access: formData.role.indexOf('admin') >= 0 ? 3 : 2,
      };
    }

    const addUserSuccess = await addUser(companyId, newUser);

    if (addUserSuccess) {
      navigate('../');
    }
  };

  return (
    <div
      style={{
        height: '100%',
        display: 'grid',
        gridTemplateRows: 'auto 1fr auto',
        overflow: 'hidden',
      }}
    >
      <Header title={'Add User'} closeActionCallback={'../'} />

      <form
        id='userAddForm'
        style={{ padding: '1rem 2rem', overflowY: 'auto' }}
        onSubmit={e => onSubmit(e)}
      >
        <TextInput
          label={'username'}
          showRequiredInLabel={true}
          name={'username'}
          type={'text'}
          value={username}
          onChangeHandler={onChange}
          validity={!inputErrorMessages.username}
          errorMessage={inputErrorMessages.username}
        />

        <TextInput
          label={'password'}
          showRequiredInLabel={true}
          name={'password'}
          type={'password'}
          value={password}
          onChangeHandler={onChange}
          validity={!inputErrorMessages.password}
          errorMessage={inputErrorMessages.password}
        />

        <TextInput
          label={'name'}
          showRequiredInLabel={true}
          name={'name'}
          type={'text'}
          value={name}
          onChangeHandler={onChange}
          validity={!inputErrorMessages.name}
          errorMessage={inputErrorMessages.name}
        />

        {authAccess === 99 && (
          <RadioInput
            label={'access'}
            showRequiredInLabel={true}
            inline={true}
            name={'access'}
            radioInputs={[
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
            validity={!inputErrorMessages.access}
            errorMessage={inputErrorMessages.access}
          />
        )}

        <CheckboxInput
          label={'role'}
          showRequiredInLabel={true}
          name={'role'}
          inline={true}
          checkboxInputs={[
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
          validity={!inputErrorMessages.role}
          errorMessage={inputErrorMessages.role}
        />

        {inputErrorMessages.noParam && (
          <div className='alert alert-small alert-error'>
            {inputErrorMessages.noParam}
          </div>
        )}
      </form>

      <Button
        btnStyle={'contained'}
        type={'primary'}
        block={true}
        fixBlockBtnBottom={true}
        text={'Add'}
        icon={
          !userLoading ? (
            <ArrowIcon direction='right' />
          ) : (
            <Spinner height={'1.5rem'} />
          )
        }
        submit={true}
        form={'userAddForm'}
        disabled={userLoading}
      />
    </div>
  );
};

UserAdd.propTypes = {
  auth: PropTypes.object.isRequired,
  users: PropTypes.object.isRequired,
  companies: PropTypes.object.isRequired,
  addUser: PropTypes.func.isRequired,
};

const mapStateToProps = state => ({
  users: state.users,
  companies: state.companies,
});

const mapDispatchToProps = {
  addUser,
};

export default connect(mapStateToProps, mapDispatchToProps)(UserAdd);
