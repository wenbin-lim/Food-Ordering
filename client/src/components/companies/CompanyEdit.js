import React, { useEffect, useState } from 'react';
import { useDispatch } from 'react-redux';
import { useNavigate, useParams } from 'react-router-dom';

// Actions
import { setSnackbar } from '../../actions/app';

// Components
import SideSheet from '../layout/SideSheet';
import Tabs, { Tab } from '../layout/Tabs';
import TextInput from '../layout/TextInput';
import ImageInput from '../layout/ImageInput';
import SwitchInput from '../layout/SwitchInput';
import CheckboxInput from '../layout/CheckboxInput';

// Custom Hooks
import useErrors from '../../hooks/useErrors';
import useGetOne from '../../query/hooks/useGetOne';
import usePut from '../../query/hooks/usePut';

const CompanyEdit = () => {
  let { id } = useParams();
  const navigate = useNavigate();
  const dispatch = useDispatch();
  const [activeTab, setActiveTab] = useState(0);
  const onClickTab = tabIndex => setActiveTab(tabIndex);

  const { data: company, isLoading, error } = useGetOne('company', id, {
    route: `/api/companies/${id}`,
  });
  useErrors(error);

  const [
    editCompany,
    { isLoading: requesting, error: editErrors },
  ] = usePut('companies', { route: `/api/companies/${id}` });

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
    name: '',
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
    acceptedPaymentMethods: [],
    assistanceReasons: '',
    logoLarge: '',
    logoSmall: '',
    facebook: '',
    twitter: '',
    instagram: '',
  });

  const {
    name,
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

  const onSubmit = async e => {
    e.preventDefault();

    const editCompanySuccess = await editCompany({
      ...formData,
      assistanceReasons: assistanceReasons
        ? assistanceReasons.split(',').filter(reason => reason !== '')
        : [],
    });

    return (
      editCompanySuccess &&
      dispatch(setSnackbar(`Edited company of name '${name}'`, 'success'))
    );
  };

  const closeSideSheet = () => navigate('../../');

  return (
    <SideSheet wrapper={false}>
      <SideSheet.Header title='Edit Company' closeHandler={closeSideSheet}>
        <Tabs onClickTab={onClickTab} justifyTab='center'>
          <Tab name='Main' />
          <Tab name='Admin' />
          <Tab name='Logo' />
          <Tab name='Social Media' />
        </Tabs>
      </SideSheet.Header>
      <SideSheet.Content
        elementType='form'
        id='companyEditForm'
        onSubmit={onSubmit}
      >
        {activeTab === 0 && (
          <article>
            <TextInput
              label='name'
              required={true}
              name='name'
              type='text'
              value={name}
              onChangeHandler={onChange}
              error={inputErrors.name}
            />

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

            <TextInput
              label='Assistance Reasons'
              name='assistanceReasons'
              type='text'
              value={assistanceReasons}
              onChangeHandler={onChange}
              informationText='Separate with commas'
              error={inputErrors.assistanceReasons}
            />
          </article>
        )}

        {activeTab === 1 && (
          <article>
            <h3 className='heading-3 text-center'>GST</h3>
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

            <h3 className='heading-3 text-center mt-3'>Service Charge</h3>
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

            <h3 className='heading-3 text-center mt-3'>Invoice</h3>
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
          </article>
        )}

        {activeTab === 2 && (
          <article>
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
          </article>
        )}

        {activeTab === 3 && (
          <article>
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
          </article>
        )}
      </SideSheet.Content>
      <SideSheet.FooterButton
        text='edit'
        requesting={requesting}
        form='companyEditForm'
      />
    </SideSheet>
  );
};

export default CompanyEdit;
