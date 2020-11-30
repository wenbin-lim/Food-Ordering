import React, { useState } from 'react';
import { useDispatch } from 'react-redux';
import { useNavigate } from 'react-router-dom';

// Actions
import { setSnackbar } from '../../actions/app';

// Components
import SideSheet from '../layout/SideSheet';
import TextInput from '../layout/TextInput';
import ImageInput from '../layout/ImageInput';

// Custom Hooks
import useErrors from '../../hooks/useErrors';
import usePost from '../../query/hooks/usePost';

const CompanyAdd = () => {
  const navigate = useNavigate();
  const dispatch = useDispatch();

  const [addCompany, { isLoading: requesting, error }] = usePost('companies', {
    route: '/api/companies',
  });
  const [inputErrors] = useErrors(error, [
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

  const onChange = ({ name, value }) =>
    setFormData({ ...formData, [name]: value });

  const onSubmit = async e => {
    e.preventDefault();

    const addCompanySuccess = await addCompany(formData);

    return (
      addCompanySuccess &&
      dispatch(setSnackbar(`Added company of name '${name}'`, 'success'))
    );
  };

  return (
    <SideSheet>
      <SideSheet.Header
        title='Add Company'
        closeHandler={() => navigate('../')}
      />
      <SideSheet.Content
        elementType='form'
        id='companyAddForm'
        onSubmit={onSubmit}
      >
        <TextInput
          label='name'
          required={true}
          name='name'
          type='text'
          value={name}
          onChangeHandler={onChange}
          error={inputErrors.name}
        />

        <ImageInput
          label='Logo (large)'
          name='logoLarge'
          value={logoLarge}
          onChangeHandler={onChange}
          error={inputErrors.logoLarge}
        />

        <ImageInput
          label='Logo (small)'
          name='logoSmall'
          value={logoSmall}
          onChangeHandler={onChange}
          error={inputErrors.logoSmall}
        />

        <TextInput
          label='facebook'
          name='facebook'
          type='text'
          value={facebook}
          onChangeHandler={onChange}
          error={inputErrors.facebook}
        />

        <TextInput
          label='twitter'
          name='twitter'
          type='text'
          value={twitter}
          onChangeHandler={onChange}
          error={inputErrors.twitter}
        />

        <TextInput
          label='instagram'
          name='instagram'
          type='text'
          value={instagram}
          onChangeHandler={onChange}
          error={inputErrors.instagram}
        />
      </SideSheet.Content>
      <SideSheet.FooterButton
        text='add'
        requesting={requesting}
        form='companyAddForm'
      />
    </SideSheet>
  );
};

export default CompanyAdd;
