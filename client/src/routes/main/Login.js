import React, { useState } from 'react';
import PropTypes from 'prop-types';
import { Navigate } from 'react-router-dom';
import { connect } from 'react-redux';

// Components
import TextInput from '../../components/layout/TextInput';
import Button from '../../components/layout/Button';
import Spinner from '../../components/layout/Spinner';

// Icons
import ArrowIcon from '../../components/icons/ArrowIcon';

// actions
import { login } from '../../actions/auth';

// Custom Hooks
import useInputError from '../../hooks/useInputError';

const Login = ({ auth: { loading, errors, access, company }, login }) => {
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

  if (!loading && company && access > 2) {
    return <Navigate to={`/${company.name}`} />;
    // do further navigation in future
  }

  return (
    <form className='loginform' onSubmit={e => onSubmit(e)}>
      <section className='loginform-header'>Login now</section>
      <section className='loginform-content'>
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
      </section>

      <section className='loginform-footer'>
        <Button
          fill={'contained'}
          type={'primary'}
          block={true}
          submit={true}
          blockBtnBottom={true}
          text={'Login'}
          icon={
            loading ? (
              <Spinner height='1rem' />
            ) : (
              <ArrowIcon direction='right' />
            )
          }
          disabled={loading}
        />
      </section>
    </form>
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
