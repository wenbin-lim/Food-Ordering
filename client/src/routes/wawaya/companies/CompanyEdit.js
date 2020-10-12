import React, { useEffect, useState, useRef } from 'react';
import PropTypes from 'prop-types';
import { connect } from 'react-redux';
import { useNavigate, useParams } from 'react-router-dom';

// Actions
import { getCompany, editCompany } from '../../../actions/companies';

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

  @name       getCompany 
  @type       function
  @desc       redux action to retrieve company info from redux state
  @required   true

  @name       editCompany 
  @type       function
  @desc       redux action to edit company
  @required   true
*/
const CompanyEdit = ({
  companies: { company, companyLoading, companyErrors },
  getCompany,
  editCompany,
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

  let { id } = useParams();

  useEffect(() => {
    getCompany(id);
  }, [id]);

  // Component state to change input field values
  const [formData, setFormData] = useState({
    name: '',
    logoLarge: '',
    logoSmall: '',
    facebook: '',
    twitter: '',
    instagram: '',
  });

  useEffect(() => {
    if (company) {
      setFormData({
        name: company.displayedName ? company.displayedName : '',
        logoLarge: company.logo && company.logo.large ? company.logo.large : '',
        logoSmall: company.logo && company.logo.small ? company.logo.small : '',
        facebook:
          company.socialMediaLinks && company.socialMediaLinks.facebook
            ? company.socialMediaLinks.facebook
            : '',
        twitter:
          company.socialMediaLinks && company.socialMediaLinks.twitter
            ? company.socialMediaLinks.twitter
            : '',
        instagram:
          company.socialMediaLinks && company.socialMediaLinks.instagram
            ? company.socialMediaLinks.instagram
            : '',
      });
    }
  }, [company]);

  const { name, logoLarge, logoSmall, facebook, twitter, instagram } = formData;

  const onChange = ({ name, value }) => {
    setFormData({ ...formData, [name]: value });
  };

  const navigate = useNavigate();

  const onSubmit = async e => {
    e.preventDefault();

    const editCompanySuccess = await editCompany(id, formData);

    if (editCompanySuccess) {
      // go back to 'wawaya/company'
      navigate('../../');
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
      <Header title={'Edit Company'} closeActionCallback={-1} />

      <form
        id='companyEditForm'
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
        text={'Edit'}
        icon={
          !companyLoading ? (
            <ArrowIcon direction='right' />
          ) : (
            <Spinner height={'1.5rem'} />
          )
        }
        submit={true}
        form={'companyEditForm'}
        disabled={companyLoading}
      />
    </div>
  );
};

CompanyEdit.propTypes = {
  companies: PropTypes.object.isRequired,
  getCompany: PropTypes.func.isRequired,
  editCompany: PropTypes.func.isRequired,
};

const mapStateToProps = state => ({
  companies: state.companies,
});

const mapDispatchToProps = {
  getCompany,
  editCompany,
};

export default connect(mapStateToProps, mapDispatchToProps)(CompanyEdit);
