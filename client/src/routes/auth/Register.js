import React, { useEffect, useState } from 'react';
import PropTypes from 'prop-types';
import { Navigate } from 'react-router-dom';
import { connect } from 'react-redux';

// Components
import Container from '../layout/Container';
import TextInput from '../layout/TextInput';
import Button from '../layout/Button';

// actions
import { register, clearAuthError } from '../../actions/auth';

/* 
  =====
  Props
  =====
  1. auth
  @type       object
  @desc       App level auth state
  @required   true

  2. register
  @type       function
  @desc       register function from redux/actions auth.js
  @required   true

  3. clearAuthError
  @type       function
  @desc       function clear all the auth errors from redux/actions auth.js
  @required   true
*/
const Register = ({
  auth: { isAuthenticated, loading, errors },
  register,
  clearAuthError,
}) => {
  const initialInputErrorMessagesState = {
    name: '',
    username: '',
    password: '',
  };

  const [inputErrorMessages, setInputErrorMessages] = useState(
    initialInputErrorMessagesState
  );

  useEffect(() => {
    // Clear errors in auth state when component mounts for the first time
    // Errors may exist due to Login Component
    clearAuthError();

    // eslint-disable-next-line
  }, []);

  useEffect(() => {
    const newErrors = {};

    // Set appropriate invalid input message to the respective input field
    if (errors && errors.status === 400) {
      errors.data.forEach(error => {
        newErrors[error.param] = error.msg;
      });
    }

    setInputErrorMessages({ ...initialInputErrorMessagesState, ...newErrors });
    // eslint-disable-next-line
  }, [errors]);

  const [formData, setFormData] = useState({
    name: '',
    username: '',
    password: '',
  });

  const { name, username, password } = formData;

  const onChange = ({ name, value }) =>
    setFormData({ ...formData, [name]: value });

  const onSubmit = async e => {
    e.preventDefault();

    // Do some form validation here

    // Do some form validation here
    register({ name, username, password });
  };

  // Redirect after register success
  if (isAuthenticated) {
    return <Navigate to='/users' />;
  }

  return (
    <Container
      parentContent={
        <form onSubmit={e => onSubmit(e)}>
          <h1>Register User</h1>
          <TextInput
            label={'name'}
            name={'name'}
            type={'text'}
            value={name}
            onChangeHandler={onChange}
            validity={!inputErrorMessages.name}
            errorMessage={inputErrorMessages.name}
          />

          <TextInput
            label={'username'}
            name={'username'}
            type={'text'}
            value={username}
            onChangeHandler={onChange}
            validity={!inputErrorMessages.username}
            errorMessage={inputErrorMessages.username}
          />

          <TextInput
            label={'password'}
            name={'password'}
            type={'password'}
            value={password}
            onChangeHandler={onChange}
            validity={!inputErrorMessages.password}
            errorMessage={inputErrorMessages.password}
          />

          <Button
            submit={true}
            style={'contained'}
            text={'Register'}
            disabled={loading}
          />
        </form>
      }
    />
  );
};

Register.propTypes = {
  register: PropTypes.func.isRequired,
  auth: PropTypes.object.isRequired,
  clearAuthError: PropTypes.func.isRequired,
};

const mapStateToProps = state => ({
  auth: state.auth,
});

const mapDispatchToProps = {
  register,
  clearAuthError,
};

export default connect(mapStateToProps, mapDispatchToProps)(Register);
