import React, { useEffect, useState } from 'react';
import PropTypes from 'prop-types';
import { connect } from 'react-redux';
import { useNavigate, useParams } from 'react-router-dom';

// Actions
import { getCompany, editCompany } from '../../../actions/companies';

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

const CompanyEdit = ({
  companies: { requesting, company, errors },
  getCompany,
  editCompany,
}) => {
  let { id } = useParams();

  useEffect(() => {
    getCompany(id);

    // eslint-disable-next-line
  }, [id]);

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

  useEffect(() => {
    const {
      _id: companyId,
      displayedName,
      logo: { small: logoSmall, large: logoLarge } = {},
      socialMediaLinks: { facebook, twitter, instagram } = {},
    } = { ...company };

    if (companyId === id) {
      setFormData({
        name: displayedName ? displayedName : '',
        logoLarge: logoLarge ? logoLarge : '',
        logoSmall: logoSmall ? logoSmall : '',
        facebook: facebook ? facebook : '',
        twitter: twitter ? twitter : '',
        instagram: instagram ? instagram : '',
      });
    }
  }, [company, id]);

  const onChange = ({ name, value }) =>
    setFormData({ ...formData, [name]: value });

  const navigate = useNavigate();

  const onSubmit = async e => {
    e.preventDefault();

    const editCompanySuccess = await editCompany(id, formData);

    return editCompanySuccess && navigate('../');
  };

  const closeSideSheet = () => navigate('../../');

  const sideSheetContent = (
    <form id='companyEditForm' onSubmit={onSubmit}>
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
      headerTitle={'Edit Company'}
      closeSideSheetHandler={closeSideSheet}
      content={company && company._id !== id ? <Spinner /> : sideSheetContent}
      footerBtn={
        <Button
          fill={'contained'}
          type={'primary'}
          block={true}
          blockBtnBottom={true}
          text={'edit'}
          icon={
            requesting ? (
              <Spinner height={'1.5rem'} />
            ) : (
              <ArrowIcon direction='right' />
            )
          }
          disabled={requesting}
          submit={true}
          form={'companyEditForm'}
        />
      }
    />
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
