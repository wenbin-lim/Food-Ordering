import React, { useState, useEffect } from 'react';
import PropTypes from 'prop-types';
import { Navigate } from 'react-router-dom';
import { connect } from 'react-redux';

// Components
import Container from '../layout/Container';
import TextInput from '../layout/TextInput';
import Button from '../layout/Button';

// actions
import { login, clearAuthError } from '../../actions/auth';

/* 
  =====
  Props
  =====
  1. auth
  @type       object
  @desc       App level auth state
  @required   true

  2. login
  @type       function
  @desc       login function from redux/actions auth.js
  @required   true

  3. clearAuthError
  @type       function
  @desc       function clear all the auth errors from redux/actions auth.js
  @required   true
*/
const Login = ({
  auth: { isAuthenticated, loading, errors },
  login,
  clearAuthError,
}) => {
  const initialInputErrorMessagesState = {
    username: '',
    password: '',
    general: '',
  };

  const [inputErrorMessages, setInputErrorMessages] = useState(
    initialInputErrorMessagesState
  );

  useEffect(() => {
    // Clear errors in auth state when component mounts for the first time
    // Errors may exist due to Register Component
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
    } else if (errors && errors.status === 403) {
      // Set error message found below the form
      newErrors.general = errors.data;
    }

    setInputErrorMessages({ ...initialInputErrorMessagesState, ...newErrors });
    // eslint-disable-next-line
  }, [errors]);

  const [formData, setFormData] = useState({
    username: '',
    password: '',
  });

  const { username, password } = formData;

  const onChange = ({ name, value }) => {
    setFormData({ ...formData, [name]: value });
  };

  const onSubmit = async e => {
    e.preventDefault();
    login(username, password);
  };

  // Redirect if logged in
  if (isAuthenticated) {
    return <Navigate to='/users' />;
  }

  return (
    <Container
      parentContent={
        <form onSubmit={e => onSubmit(e)}>
          <h1>Login Form</h1>

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

          {inputErrorMessages.general && (
            <div className='alert alert-error'>
              {inputErrorMessages.general}
            </div>
          )}

          <Button
            submit={true}
            style={'contained'}
            text={'Login'}
            disabled={loading}
          />
        </form>
      }
    />
  );
};

Login.propTypes = {
  auth: PropTypes.object.isRequired,
  login: PropTypes.func.isRequired,
  clearAuthError: PropTypes.func.isRequired,
};

const mapStateToProps = state => ({
  auth: state.auth,
});

const mapDispatchToProps = {
  login,
  clearAuthError,
};

export default connect(mapStateToProps, mapDispatchToProps)(Login);
