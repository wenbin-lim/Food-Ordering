import React, { useEffect, useState } from 'react';
import PropTypes from 'prop-types';
import { connect } from 'react-redux';
import { useParams, useNavigate } from 'react-router-dom';

// Actions
import { getUser, editUser } from '../../actions/users';

// Components
import Header from '../layout/Header';
import Spinner from '../layout/Spinner';
import TextInput from '../layout/TextInput';
import RadioInput from '../layout/RadioInput';
import CheckboxInput from '../layout/CheckboxInput';
import Button from '../layout/Button';
import Dialog from '../layout/Dialog';

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
  @desc       auth object from RouteWrapper
  @required   true

  @name       users
  @type       array of user object
  @desc       app level users state
  @desc       only require the errors(for checking form submission) and loading(check if form is submitted)
  @required   true

  @name       getUser
  @type       function
  @desc       Redux action to set user in app level users state
  @required   true
  @default    none

  @name       editUser
  @type       function
  @desc       Redux action to update the user in DB and app level users state
  @required   true
  @default    none
*/
const UserEdit = ({
  auth: { access: authAccess },
  users: { user, userLoading, userErrors },
  getUser,
  editUser,
}) => {
  let { id } = useParams();

  useEffect(() => {
    getUser(id);
  }, [id]);

  const initialInputErrorMessagesState = {
    name: '',
    username: '',
    password: '',
    general: '',
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
    access: '',
    role: [],
  });

  const { username, password, name, access, role } = formData;
  const [showChangePasswordAlert, setShowChangePasswordAlert] = useState(false);

  useEffect(() => {
    if (user) {
      setFormData({
        ...formData,
        username: user.username ? user.username : '',
        name: user.name ? user.name : '',
        access: user.access ? user.access.toString() : '',
        role: user.role ? user.role : [],
      });
    }
  }, [user]);

  const onChange = ({ name, value }) => {
    setFormData({ ...formData, [name]: value });
  };

  const checkIfChangePassword = async e => {
    e.preventDefault();

    if (formData.password) {
      setShowChangePasswordAlert(true);
    } else {
      onSubmit();
    }
  };

  const navigate = useNavigate();

  const onSubmit = async () => {
    setShowChangePasswordAlert(false);

    let newUser = formData;

    if (authAccess >= 3 && authAccess !== 99) {
      newUser = {
        ...formData,
        access: formData.role.indexOf('admin') >= 0 ? 3 : 2,
      };
    }

    const editUserSuccess = await editUser(id, newUser);

    if (editUserSuccess) {
      navigate('../');
    }
  };

  return (
    <div
      style={{
        height: '100%',
        display: 'grid',
        gridTemplateRows: 'auto 1fr auto',
      }}
    >
      <Header title={'User Edit'} closeActionCallback={'../../'} />

      {user && (
        <form
          id='userEditForm'
          style={{ padding: '1rem 2rem', overflowY: 'auto' }}
          onSubmit={checkIfChangePassword}
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
            label={'change password'}
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
      )}
      <Button
        btnStyle={'contained'}
        type={'primary'}
        block={true}
        fixBlockBtnBottom={true}
        text={'Edit'}
        icon={
          !userLoading ? (
            <ArrowIcon direction='right' />
          ) : (
            <Spinner height={'1.5rem'} />
          )
        }
        submit={true}
        form={'userEditForm'}
        disabled={userLoading}
      />
      {showChangePasswordAlert && (
        <Dialog
          content={
            <h2 className='heading-2 text-center' style={{ padding: '3rem 0' }}>
              Change password?
            </h2>
          }
          footer={
            <div
              style={{
                display: 'flex',
                justifyContent: 'space-evenly',
              }}
            >
              <Button
                btnStyle={'contained'}
                type={'error'}
                text={'Change'}
                additionalStyles={{ flex: '1', marginRight: '1rem' }}
                onClick={() => onSubmit()}
              />
              <Button
                btnStyle={'outline'}
                color={'var(--on-background)'}
                text={'Cancel'}
                additionalStyles={{ flex: '1', marginLeft: '1rem' }}
                onClick={() => setShowChangePasswordAlert(false)}
              />
            </div>
          }
          closeDialogHandler={() => setShowChangePasswordAlert(false)}
        />
      )}
    </div>
  );
};

UserEdit.propTypes = {
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
