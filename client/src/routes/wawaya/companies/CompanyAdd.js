import React, { useState } from 'react';
import PropTypes from 'prop-types';
import { connect } from 'react-redux';
import { useNavigate } from 'react-router-dom';

// Actions
import { addCompany } from '../../../actions/companies';

// Components
import SideSheet from '../../../components/layout/SideSheet';
import Spinner from '../../../components/layout/Spinner';
import TextInput from '../../../components/layout/TextInput';
import ImageInput from '../../../components/layout/ImageInput';
import Button from '../../../components/layout/Button';

// Icons
import ArrowIcon from '../../../components/icons/ArrowIcon';

// Custom Hooks
import useInputError from '../../../hooks/useInputError';

const CompanyAdd = ({ companies: { requesting, errors }, addCompany }) => {
  const [inputErrorMessages] = useInputError(
    {
      name: '',
      logoLarge: '',
      logoSmall: '',
      facebook: '',
      twitter: '',
      instagram: '',
    },
    errors
  );

  const [formData, setFormData] = useState({
    name: '',
    logoLarge: '',
    logoSmall: '',
    facebook: '',
    twitter: '',
    instagram: '',
  });

  const { name, logoLarge, logoSmall, facebook, twitter, instagram } = formData;

  const onChange = ({ name, value }) =>
    setFormData({ ...formData, [name]: value });

  const navigate = useNavigate();

  const onSubmit = async e => {
    e.preventDefault();

    const addCompanySuccess = await addCompany(formData);

    return addCompanySuccess && closeSideSheet();
  };

  const closeSideSheet = () => navigate('../');

  const sideSheetContent = (
    <form id='companyAddForm' onSubmit={onSubmit}>
      <div className='row'>
        <div className='col'>
          <TextInput
            label={'name'}
            required={true}
            name={'name'}
            type={'text'}
            value={name}
            onChangeHandler={onChange}
            error={inputErrorMessages.name}
          />
        </div>
      </div>

      <div className='row'>
        <div className='col'>
          <ImageInput
            label={'Logo (large)'}
            name={'logoLarge'}
            value={logoLarge}
            onChangeHandler={onChange}
            error={inputErrorMessages.logoLarge}
          />
        </div>
      </div>

      <div className='row'>
        <div className='col'>
          <ImageInput
            label={'Logo (small)'}
            name={'logoSmall'}
            value={logoSmall}
            onChangeHandler={onChange}
            error={inputErrorMessages.logoSmall}
          />
        </div>
      </div>

      <div className='row'>
        <div className='col'>
          <TextInput
            label={'facebook'}
            name={'facebook'}
            type={'text'}
            value={facebook}
            onChangeHandler={onChange}
            error={inputErrorMessages.facebook}
          />
        </div>
      </div>

      <div className='row'>
        <div className='col'>
          <TextInput
            label={'twitter'}
            name={'twitter'}
            type={'text'}
            value={twitter}
            onChangeHandler={onChange}
            error={inputErrorMessages.twitter}
          />
        </div>
      </div>

      <div className='row'>
        <div className='col'>
          <TextInput
            label={'instagram'}
            name={'instagram'}
            type={'text'}
            value={instagram}
            onChangeHandler={onChange}
            error={inputErrorMessages.instagram}
          />
        </div>
      </div>
    </form>
  );

  return (
    <SideSheet
      wrapper={false}
      headerTitle={'Add Company'}
      closeSideSheetHandler={closeSideSheet}
      content={sideSheetContent}
      footerBtn={
        <Button
          fill={'contained'}
          type={'primary'}
          block={true}
          blockBtnBottom={true}
          text={'add'}
          icon={
            requesting ? (
              <Spinner height={'1.5rem'} />
            ) : (
              <ArrowIcon direction='right' />
            )
          }
          disabled={requesting}
          submit={true}
          form={'companyAddForm'}
        />
      }
    />
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
