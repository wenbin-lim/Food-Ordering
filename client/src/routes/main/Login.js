import React, { useState, Fragment } from 'react';
import PropTypes from 'prop-types';
import { Navigate } from 'react-router-dom';
import { connect } from 'react-redux';

// Components
import Container from '../../components/layout/Container';
import TextInput from '../../components/layout/TextInput';
import Button from '../../components/layout/Button';
import Spinner from '../../components/layout/Spinner';

// Icons
import ArrowIcon from '../../components/icons/ArrowIcon';

// Actions
import { login } from '../../actions/auth';

// Custom Hooks
import useInputError from '../../hooks/useInputError';

const Login = ({ auth: { loading, errors, user }, login }) => {
  const [inputErrorMessages] = useInputError(
    {
      username: '',
      password: '',
    },
    errors
  );

  const [formData, setFormData] = useState({
    username: '',
    password: '',
  });

  const { username, password } = formData;

  const onChange = ({ name, value }) =>
    setFormData({ ...formData, [name]: value });

  const onSubmit = async e => {
    e.preventDefault();
    login(username, password);
  };

  if (user) {
    const {
      company: { name: companyName },
    } = user;

    return <Navigate to={`/${companyName}`} />;
  }

  const loginForm = (
    <Fragment>
      <header className='login-header'>Login now</header>
      <form id='login-form' className='login-content' onSubmit={onSubmit}>
        <TextInput
          label={'username'}
          name={'username'}
          type={'text'}
          value={username}
          onChangeHandler={onChange}
          error={inputErrorMessages.username}
        />

        <TextInput
          label={'password'}
          name={'password'}
          type={'password'}
          value={password}
          onChangeHandler={onChange}
          error={inputErrorMessages.password}
        />
      </form>
      <Button
        classes={'login-footer'}
        fill={'contained'}
        type={'primary'}
        block={true}
        blockBtnBottom={true}
        submit={true}
        form={'login-form'}
        text={'Login'}
        icon={
          loading ? (
            <Spinner height='1.5rem' />
          ) : (
            <ArrowIcon direction='right' />
          )
        }
        disabled={loading}
      />
    </Fragment>
  );

  // return <Container parentClass={'login'} parentContent={loginForm} />;
  return loginForm;
};

Login.propTypes = {
  auth: PropTypes.object.isRequired,
  login: PropTypes.func.isRequired,
};

const mapStateToProps = state => ({
  auth: state.auth,
});

const mapDispatchToProps = {
  login,
};

export default connect(mapStateToProps, mapDispatchToProps)(Login);
