import React, { useState } from 'react';
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
import useErrors from '../../hooks/useErrors';

const Login = ({ auth: { loading, errors, user }, login }) => {
  const [inputErrors] = useErrors(errors, ['username', 'password']);

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

  if (user && user.access >= 2) {
    return <Navigate to={`/${user?.company?.name}`} />;
  }

  return (
    <Container
      elementType='form'
      id='loginForm'
      className='loginform'
      onSubmit={onSubmit}
    >
      <header className='loginform-header'>Login now</header>
      <section className='loginform-content'>
        <TextInput
          label={'username'}
          name={'username'}
          type={'text'}
          value={username}
          onChangeHandler={onChange}
          error={inputErrors.username}
        />

        <TextInput
          label={'password'}
          name={'password'}
          type={'password'}
          value={password}
          onChangeHandler={onChange}
          error={inputErrors.password}
        />
      </section>
      <Button
        className={'loginform-footer'}
        fill={'contained'}
        type={'primary'}
        block={true}
        blockBtnBottom={true}
        submit={true}
        form={'loginForm'}
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
    </Container>
  );
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
