/* eslint-disable */
import React, { useState, useEffect, useRef, Fragment } from 'react';
import PropTypes from 'prop-types';
import { useDispatch } from 'react-redux';

// Actions
import { setSnackbar } from '../../actions/app';

// Components
import Container from '../layout/Container';
import Tabs, { Tab } from '../layout/Tabs';
import Button from '../layout/Button';
import TextInput from '../layout/TextInput';
import ImageInput from '../layout/ImageInput';
import SwitchInput from '../layout/SwitchInput';
import CheckboxInput from '../layout/CheckboxInput';

// Icons
import ArrowIcon from '../icons/ArrowIcon';

// Custom Hooks
import useErrors from '../../hooks/useErrors';
import useGetOne from '../../query/hooks/useGetOne';
import usePut from '../../query/hooks/usePut';

const AdminSettings = ({ company: companyId }) => {
  const dispatch = useDispatch();
  const { data: company, isLoading, error } = useGetOne('company', companyId, {
    route: `/api/companies/${companyId}`,
  });
  useErrors(error);

  const [
    editCompany,
    { isLoading: requesting, error: editErrors },
  ] = usePut('companies', { route: `/api/companies/${companyId}` });
  const [inputErrors] = useErrors(editErrors, [
    'name',
    'companyCode',
    'address',
    'contact',
    'gstRegNo',
    'acceptedPaymentMethods',
    'logoLarge',
    'logoSmall',
    'facebook',
    'twitter',
    'instagram',
  ]);

  const [formData, setFormData] = useState({
    companyCode: '',
    address: '',
    contact: '',
    gstRegistered: true,
    gstRegNo: '',
    hasServiceCharge: true,
    roundTotalPrice: true,
    roundDownTotalPrice: true,
    pricesIncludesGst: true,
    pricesIncludesServiceCharge: true,
    assistanceReasons: '',
    acceptedPaymentMethods: [],
    logoLarge: '',
    logoSmall: '',
    facebook: '',
    twitter: '',
    instagram: '',
  });

  const {
    companyCode,
    address,
    contact,
    gstRegistered,
    gstRegNo,
    hasServiceCharge,
    roundTotalPrice,
    roundDownTotalPrice,
    pricesIncludesGst,
    pricesIncludesServiceCharge,
    acceptedPaymentMethods,
    assistanceReasons,
    logoLarge,
    logoSmall,
    facebook,
    twitter,
    instagram,
  } = formData;

  useEffect(() => {
    if (company) {
      const {
        displayedName,
        companyCode,
        address,
        contact,
        gstRegistered,
        gstRegNo,
        hasServiceCharge,
        roundTotalPrice,
        roundDownTotalPrice,
        pricesIncludesGst,
        pricesIncludesServiceCharge,
        acceptedPaymentMethods,
        assistanceReasons,
        logo: { small: logoSmall, large: logoLarge } = {},
        socialMediaLinks: { facebook, twitter, instagram } = {},
      } = company;

      setFormData({
        name: displayedName ? displayedName : '',
        companyCode: companyCode ? companyCode : '',
        address: address ? address : '',
        contact: contact ? contact : '',
        gstRegistered:
          typeof gstRegistered === 'boolean' ? gstRegistered : true,
        gstRegNo: gstRegNo ? gstRegNo : '',
        hasServiceCharge:
          typeof hasServiceCharge === 'boolean' ? hasServiceCharge : true,
        roundTotalPrice:
          typeof roundTotalPrice === 'boolean' ? roundTotalPrice : true,
        roundDownTotalPrice:
          typeof roundDownTotalPrice === 'boolean' ? roundDownTotalPrice : true,
        pricesIncludesGst:
          typeof pricesIncludesGst === 'boolean' ? pricesIncludesGst : true,
        pricesIncludesServiceCharge:
          typeof pricesIncludesServiceCharge === 'boolean'
            ? pricesIncludesServiceCharge
            : true,
        acceptedPaymentMethods: Array.isArray(acceptedPaymentMethods)
          ? acceptedPaymentMethods
          : [],
        assistanceReasons: Array.isArray(assistanceReasons)
          ? assistanceReasons.join(',')
          : '',
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

  const onCompanyEdit = async e => {
    e.preventDefault();

    const editCompanySuccess = await editCompany({
      ...formData,
      assistanceReasons: assistanceReasons
        ? assistanceReasons.split(',').filter(reason => reason.trim().length)
        : [],
    });

    return (
      editCompanySuccess &&
      dispatch(setSnackbar('Settings changed!', 'success'))
    );
  };

  return (
    <Container className='adminsettings'>
      <Tabs className='adminsettings-tabs'>
        <Tab name='Company' className='adminsettings-form'>
          <TextInput
            label='Company Code'
            required={true}
            name='companyCode'
            type='text'
            value={companyCode}
            onChangeHandler={onChange}
            informationText='1 to 4 characters'
            error={inputErrors.companyCode}
          />

          <TextInput
            label='address'
            required={true}
            name='address'
            type='text'
            value={address}
            onChangeHandler={onChange}
            error={inputErrors.address}
          />

          <TextInput
            label='contact'
            required={true}
            name='contact'
            type='text'
            value={contact}
            onChangeHandler={onChange}
            error={inputErrors.contact}
          />

          <SwitchInput
            label='GST Registered'
            name='gstRegistered'
            value={gstRegistered}
            onChangeHandler={onChange}
          />

          {gstRegistered === true && (
            <TextInput
              label='GST Registration No'
              required={true}
              name='gstRegNo'
              type='text'
              value={gstRegNo}
              onChangeHandler={onChange}
              error={inputErrors.gstRegNo}
            />
          )}

          {gstRegistered === true && (
            <SwitchInput
              label='Menu prices includes GST ?'
              name='pricesIncludesGst'
              value={pricesIncludesGst}
              onChangeHandler={onChange}
            />
          )}

          <SwitchInput
            label='Service Charge'
            name='hasServiceCharge'
            value={hasServiceCharge}
            onChangeHandler={onChange}
          />

          {hasServiceCharge === true && (
            <SwitchInput
              label='Menu prices includes service charge ?'
              name='pricesIncludesServiceCharge'
              value={pricesIncludesServiceCharge}
              onChangeHandler={onChange}
            />
          )}

          <CheckboxInput
            label='Accepted Payment Methods'
            name='acceptedPaymentMethods'
            inputs={['cash', 'visa', 'master'].map(method => ({
              key: method.toUpperCase(),
              value: method,
            }))}
            value={acceptedPaymentMethods}
            onChangeHandler={onChange}
            inline={true}
            error={inputErrors.acceptedPaymentMethods}
          />

          <SwitchInput
            label='Allow rounding for invoice?'
            name='roundTotalPrice'
            value={roundTotalPrice}
            onChangeHandler={onChange}
          />

          {roundTotalPrice === true && (
            <SwitchInput
              label='Rounding up or down?'
              name='roundDownTotalPrice'
              value={roundDownTotalPrice}
              onChangeHandler={onChange}
            />
          )}

          <TextInput
            label='Assistance Reasons'
            name='assistanceReasons'
            type='text'
            value={assistanceReasons}
            onChangeHandler={onChange}
            informationText='Separate with commas'
            error={inputErrors.assistanceReasons}
          />
        </Tab>

        <Tab name='Theme' className='adminsettings-form'>
          <ImageInput
            label='Logo (large)'
            name='logoLarge'
            value={logoLarge}
            onChangeHandler={onChange}
            error={inputErrors.logoLarge}
            informationText='Please choose an image of .png with no background'
          />

          <ImageInput
            label='Logo (small)'
            name='logoSmall'
            value={logoSmall}
            onChangeHandler={onChange}
            error={inputErrors.logoSmall}
            informationText='Please choose an image of .png with no background'
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
        </Tab>
      </Tabs>

      <Button
        className='adminsettings-footer-btn'
        fill='contained'
        type='primary'
        text='Edit'
        icon={<ArrowIcon direction='right' />}
        onClick={onCompanyEdit}
      />
    </Container>
  );
};

AdminSettings.propTypes = {
  company: PropTypes.string,
};

export default AdminSettings;
