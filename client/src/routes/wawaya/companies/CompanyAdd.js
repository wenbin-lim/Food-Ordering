import React, { useState } from 'react';
import PropTypes from 'prop-types';
import { connect } from 'react-redux';
import { useNavigate } from 'react-router-dom';

// Actions
import { addCompany } from '../../../actions/companies';

// Components
import Header from '../../../components/layout/Header';
import Spinner from '../../../components/layout/Spinner';
import TextInput from '../../../components/layout/TextInput';
import ImageInput from '../../../components/layout/ImageInput';
import Button from '../../../components/layout/Button';

// Icons
import ArrowIcon from '../../../components/icons/ArrowIcon';

// Custom Hooks
import useInputError from '../../../hooks/useInputError';

/* 
  =====
  Props
  =====
  @name       companies 
  @type       object
  @desc       app level companies state
  @required   true

  @name       addCompany 
  @type       function
  @desc       action to add new company to db
  @required   true
*/
const CompanyAdd = ({
  companies: { companyLoading, companyErrors },
  addCompany,
}) => {
  const initialInputErrorMessagesState = {
    name: '',
    logoLarge: '',
    logoSmall: '',
    facebook: '',
    twitter: '',
    instagram: '',
  };

  const [inputErrorMessages] = useInputError(
    initialInputErrorMessagesState,
    companyErrors
  );

  // Component state to change input field values
  const [formData, setFormData] = useState({
    name: '',
    logoLarge: '',
    logoSmall: '',
    facebook: '',
    twitter: '',
    instagram: '',
  });

  const { name, logoLarge, logoSmall, facebook, twitter, instagram } = formData;

  const onChange = ({ name, value }) => {
    setFormData({ ...formData, [name]: value });
  };

  const navigate = useNavigate();

  const onSubmit = async e => {
    e.preventDefault();

    const addCompanySuccess = await addCompany(formData);

    if (addCompanySuccess) {
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
      <Header title={'Add Company'} closeActionCallback={'../'} />

      <form
        id='companyAddForm'
        style={{ padding: '1rem 2rem', overflowY: 'auto' }}
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

        <h3 className='heading-3' style={{ marginTop: '1rem' }}>
          Logo
        </h3>
        <ImageInput
          label={'Large'}
          name={'logoLarge'}
          value={logoLarge}
          onChangeHandler={onChange}
          validity={!inputErrorMessages.logoLarge}
          errorMessage={inputErrorMessages.logoLarge}
        />
        <ImageInput
          label={'Small'}
          name={'logoSmall'}
          value={logoSmall}
          onChangeHandler={onChange}
          validity={!inputErrorMessages.logoSmall}
          errorMessage={inputErrorMessages.logoSmall}
        />

        <h3 className='heading-3' style={{ marginTop: '1rem' }}>
          Social Media Links
        </h3>
        <TextInput
          label={'facebook'}
          name={'facebook'}
          type={'text'}
          value={facebook}
          onChangeHandler={onChange}
          validity={!inputErrorMessages.facebook}
          errorMessage={inputErrorMessages.facebook}
        />

        <TextInput
          label={'twitter'}
          name={'twitter'}
          type={'text'}
          value={twitter}
          onChangeHandler={onChange}
          validity={!inputErrorMessages.twitter}
          errorMessage={inputErrorMessages.twitter}
        />

        <TextInput
          label={'instagram'}
          name={'instagram'}
          type={'text'}
          value={instagram}
          onChangeHandler={onChange}
          validity={!inputErrorMessages.instagram}
          errorMessage={inputErrorMessages.instagram}
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
          !companyLoading ? (
            <ArrowIcon direction='right' />
          ) : (
            <Spinner height={'1.5rem'} />
          )
        }
        submit={true}
        form={'companyAddForm'}
        disabled={companyLoading}
      />
    </div>
  );
};

CompanyAdd.propTypes = {
  companies: PropTypes.object.isRequired,
  addCompany: PropTypes.func.isRequired,
};

const mapStateToProps = state => ({
  companies: state.companies,
});

const mapDispatchToProps = {
  addCompany,
};

export default connect(mapStateToProps, mapDispatchToProps)(CompanyAdd);
