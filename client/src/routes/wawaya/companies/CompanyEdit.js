import React, { useEffect, useState } from 'react';
import { useDispatch } from 'react-redux';
import { useNavigate, useParams } from 'react-router-dom';

// Actions
import { setSnackbar } from '../../../actions/app';

// Components
import SideSheet from '../../../components/layout/SideSheet';
import TextInput from '../../../components/layout/TextInput';
import ImageInput from '../../../components/layout/ImageInput';

// Custom Hooks
import useErrors from '../../../hooks/useErrors';
import useGetOne from '../../../query/hooks/useGetOne';
import useEditOne from '../../../query/hooks/useEditOne';

const CompanyEdit = () => {
  let { id } = useParams();
  const navigate = useNavigate();
  const dispatch = useDispatch();

  const { data: company, isLoading, error } = useGetOne('company', id);
  const [
    editCompany,
    { isLoading: requesting, error: editErrors },
  ] = useEditOne('companies');
  useErrors(error);

  const [inputErrors] = useErrors(editErrors, [
    'name',
    'logoLarge',
    'logoSmall',
    'facebook',
    'twitter',
    'instagram',
  ]);

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
    if (company) {
      const {
        displayedName,
        logo: { small: logoSmall, large: logoLarge } = {},
        socialMediaLinks: { facebook, twitter, instagram } = {},
      } = company;

      setFormData({
        name: displayedName ? displayedName : '',
        logoLarge: logoLarge ? logoLarge : '',
        logoSmall: logoSmall ? logoSmall : '',
        facebook: facebook ? facebook : '',
        twitter: twitter ? twitter : '',
        instagram: instagram ? instagram : '',
      });
    }
  }, [isLoading, company]);

  const onChange = ({ name, value }) =>
    setFormData({ ...formData, [name]: value });

  const onSubmit = async e => {
    e.preventDefault();

    const editCompanySuccess = await editCompany({ id, newItem: formData });

    return (
      editCompanySuccess &&
      dispatch(setSnackbar(`Edited company of name '${name}'`, 'success'))
    );
  };

  const closeSideSheet = () => navigate('../../');

  return (
    <SideSheet wrapper={false}>
      <SideSheet.Header title={'Edit Company'} closeHandler={closeSideSheet} />
      <SideSheet.Content
        elementType={'form'}
        id={'companyEditForm'}
        onSubmit={onSubmit}
      >
        <TextInput
          label={'name'}
          required={true}
          name={'name'}
          type={'text'}
          value={name}
          onChangeHandler={onChange}
          error={inputErrors.name}
        />

        <ImageInput
          label={'Logo (large)'}
          name={'logoLarge'}
          value={logoLarge}
          onChangeHandler={onChange}
          error={inputErrors.logoLarge}
        />

        <ImageInput
          label={'Logo (small)'}
          name={'logoSmall'}
          value={logoSmall}
          onChangeHandler={onChange}
          error={inputErrors.logoSmall}
        />

        <TextInput
          label={'facebook'}
          name={'facebook'}
          type={'text'}
          value={facebook}
          onChangeHandler={onChange}
          error={inputErrors.facebook}
        />

        <TextInput
          label={'twitter'}
          name={'twitter'}
          type={'text'}
          value={twitter}
          onChangeHandler={onChange}
          error={inputErrors.twitter}
        />

        <TextInput
          label={'instagram'}
          name={'instagram'}
          type={'text'}
          value={instagram}
          onChangeHandler={onChange}
          error={inputErrors.instagram}
        />
      </SideSheet.Content>
      <SideSheet.FooterButton
        text={'edit'}
        requesting={requesting}
        form={'companyEditForm'}
      />
    </SideSheet>
  );
};

export default CompanyEdit;
