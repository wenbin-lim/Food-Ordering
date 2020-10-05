import React, { useEffect, useState } from 'react';
import PropTypes from 'prop-types';
import { connect } from 'react-redux';
import { useParams } from 'react-router-dom';

// Actions
import { getUser, updateUser } from '../../actions/users';

// Components
import Header from '../layout/Header';
import Spinner from '../layout/Spinner';
import TextInput from '../layout/TextInput';
import Button from '../layout/Button';

// Icons
import ArrowIcon from '../icons/ArrowIcon';

/* 
  =====
  Props
  =====
  @name       user
  @type       object
  @desc       user object from Parent
  @required   true

  @name       users 
  @type       array of user object
  @desc       app level users state
  @desc       only require the errors(for checking form submission) and loading(check if form is submitted)
  @required   true

  @name       updateUser 
  @type       function
  @desc       Redux action to update the user in DB and app level users state
  @required   true
  @default    none
*/
const UserEdit = ({
  getUser,
  users: { user, userLoading, userUpdateLoading, userUpdateErrors },
  updateUser,
}) => {
  const initialInputErrorMessagesState = {
    name: '',
    username: '',
    password: '',
    general: '',
  };

  const [inputErrorMessages, setInputErrorMessages] = useState(
    initialInputErrorMessagesState
  );

  useEffect(() => {
    const newErrors = {};

    // Set appropriate invalid input message to the respective input field
    if (userUpdateErrors && userUpdateErrors.status === 400) {
      userUpdateErrors.data.forEach(error => {
        newErrors[error.param] = error.msg;
      });
    } else if (userUpdateErrors && userUpdateErrors.status === 406) {
      // Set error message found below the form
      newErrors.general = userUpdateErrors.data;
    }

    setInputErrorMessages({ ...initialInputErrorMessagesState, ...newErrors });
    // eslint-disable-next-line
  }, [userUpdateErrors]);

  // Component state to change input field values
  const [formData, setFormData] = useState({
    username: '',
    name: '',
    password: '',
  });

  const { name, username, password } = formData;

  let { id } = useParams();

  useEffect(() => {
    getUser(id);
    // eslint-disable-next-line
  }, [id]);

  useEffect(() => {
    if (user) {
      setFormData({
        ...formData,
        username: user.username ? user.username : '',
        name: user.name ? user.name : '',
      });
    }
    // eslint-disable-next-line
  }, [user]);

  const onChange = ({ name, value }) => {
    setFormData({ ...formData, [name]: value });
  };

  const onSubmit = async e => {
    e.preventDefault();

    updateUser(user._id, name, username, password);
  };

  return (
    <div
      style={{
        height: '100%',
        display: 'grid',
        gridTemplateRows: 'auto 1fr auto',
      }}
    >
      <Header title={'User Edit'} closeActionCallback={'/users'} />

      {!userLoading && user ? (
        <form
          id='userEditForm'
          style={{ padding: '1rem 2rem' }}
          onSubmit={e => onSubmit(e)}
        >
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
          {inputErrorMessages.general && (
            <div className='alert alert-small alert-error'>
              {inputErrorMessages.general}
            </div>
          )}
        </form>
      ) : (
        <Spinner height={'2rem'} />
      )}

      <Button
        style={'contained'}
        block={true}
        fixBlockBtnBottom={true}
        text={'Edit'}
        icon={
          !userUpdateLoading ? (
            <ArrowIcon direction='right' />
          ) : (
            <Spinner height={'1.5rem'} />
          )
        }
        submit={true}
        form={'userEditForm'}
        disabled={userUpdateLoading}
      />
    </div>
  );
};

UserEdit.propTypes = {
  getUser: PropTypes.func.isRequired,
  users: PropTypes.object.isRequired,
  updateUser: PropTypes.func.isRequired,
};

const mapStateToProps = state => ({
  users: state.users,
});

const mapDispatchToProps = {
  getUser,
  updateUser,
};

export default connect(mapStateToProps, mapDispatchToProps)(UserEdit);
