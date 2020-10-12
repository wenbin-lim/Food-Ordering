import React, { useState, useEffect, Fragment } from 'react';
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

// actions
import { loadToken, login } from '../../actions/auth';

// Custom Hooks
import useInputError from '../../hooks/useInputError';

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
  auth: { loading, errors, access, company },
  loadToken,
  login,
}) => {
  const initialInputErrorMessagesState = {
    username: '',
    password: '',
  };

  const [inputErrorMessages] = useInputError(
    initialInputErrorMessagesState,
    errors
  );

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

  useEffect(() => {
    loadToken();
    // eslint-disable-next-line
  }, []);

  if (!loading && company && access > 1) {
    return <Navigate to={`/${company.name}`} />;
    // do further navigation in future
  }

  return (
    <Container
      parentStyle={{
        maxWidth: '500px',
        margin: '64px auto 0 auto',
        display: 'grid',
        gridTemplateRows: 'auto 320px 1fr',
      }}
      parentContent={
        <Fragment>
          <h1 className='heading-1 text-center'>Login now</h1>
          <form
            onSubmit={e => onSubmit(e)}
            style={{
              borderRadius: '48px',
              overflow: 'hidden',
              display: 'grid',
              gridTemplateRows: '1fr auto',
            }}
          >
            <div
              style={{
                padding: '0 4px',
                paddingTop: '16px',
              }}
            >
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

              {inputErrorMessages.noParam && (
                <div className='alert alert-error'>
                  {inputErrorMessages.noParam}
                </div>
              )}
            </div>

            <Button
              submit={true}
              type={'primary'}
              btnStyle={'contained'}
              block={true}
              fixBlockBtnBottom={true}
              text={'Login'}
              icon={
                loading ? (
                  <Spinner height='1rem' />
                ) : (
                  <ArrowIcon direction='right' />
                )
              }
              disabled={loading}
              additionalStyles={{
                height: '64px',
              }}
            />
          </form>
        </Fragment>
      }
    />
  );
};

Login.propTypes = {
  auth: PropTypes.object.isRequired,
  loadToken: PropTypes.func.isRequired,
  login: PropTypes.func.isRequired,
};

const mapStateToProps = state => ({
  auth: state.auth,
});

const mapDispatchToProps = {
  loadToken,
  login,
};

export default connect(mapStateToProps, mapDispatchToProps)(Login);
