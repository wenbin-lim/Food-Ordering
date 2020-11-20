import React, { useState } from 'react';
import PropTypes from 'prop-types';
import { useDispatch } from 'react-redux';
import { useNavigate } from 'react-router-dom';
import { queryCache } from 'react-query';

// Actions
import { setSnackbar } from '../../actions/app';

// Components
import SideSheet from '../layout/SideSheet';
import Tabs, { Tab } from '../layout/Tabs';
import Dropdown from '../layout/Dropdown';
import TextInput from '../layout/TextInput';
import SwitchInput from '../layout/SwitchInput';
import Options from './options/Options';

// Custom Hooks
import useErrors from '../../hooks/useErrors';
import usePost from '../../query/hooks/usePost';

const CustomisationAdd = ({
  user: { access: userAccess },
  company: userCompanyId,
}) => {
  const navigate = useNavigate();
  const dispatch = useDispatch();
  const [activeTab, setActiveTab] = useState(0);
  const onClickTab = tabIndex => setActiveTab(tabIndex);

  const companies = queryCache.getQueryData('companies');

  const [
    addCustomisation,
    { isLoading: requesting, error },
  ] = usePost('customisations', { route: '/api/customisations' });
  const [inputErrors] = useErrors(error, ['name', 'title', 'min', 'max']);

  const [formData, setFormData] = useState({
    company: userCompanyId,
    name: '',
    title: '',
    availability: true,
    optional: false,
    min: '1',
    max: '1',
    options: [],
  });

  const {
    company,
    name,
    title,
    availability,
    optional,
    min,
    max,
    options,
  } = formData;

  const onChange = ({ name, value }) =>
    setFormData({ ...formData, [name]: value });

  const onSubmit = async e => {
    e.preventDefault();

    const addCustomisationSuccess = await addCustomisation(formData);

    return (
      addCustomisationSuccess &&
      dispatch(setSnackbar(`Added customisation of name '${name}'`, 'success'))
    );
  };

  return (
    <SideSheet wrapper={false}>
      <SideSheet.Header
        title={'Add Customisation'}
        closeHandler={() => navigate('../')}
      >
        <Tabs onClickTab={onClickTab}>
          <Tab name={'Main'} />
          <Tab name={'Options'} />
        </Tabs>
      </SideSheet.Header>
      <SideSheet.Content
        elementType={'form'}
        id={'customisationAddForm'}
        onSubmit={onSubmit}
      >
        {activeTab === 0 && (
          <article>
            {userAccess === 99 && Array.isArray(companies) && (
              <Dropdown
                required={true}
                label={'Company'}
                name={'company'}
                options={companies.map(({ _id, displayedName }) => ({
                  key: displayedName,
                  value: _id,
                }))}
                value={company}
                onChangeHandler={onChange}
              />
            )}

            <SwitchInput
              label={'Availability'}
              name={'availability'}
              value={availability}
              onChangeHandler={onChange}
            />

            <TextInput
              label={'name'}
              required={true}
              name={'name'}
              type={'text'}
              value={name}
              onChangeHandler={onChange}
              error={inputErrors.name}
            />

            <TextInput
              label={'title'}
              required={true}
              name={'title'}
              type={'text'}
              value={title}
              onChangeHandler={onChange}
              error={inputErrors.title}
            />

            <SwitchInput
              label={'optional'}
              name={'optional'}
              value={optional}
              onChangeHandler={onChange}
            />

            <div className='row'>
              {typeof optional === 'boolean' && !optional && (
                <div className='col pr-h'>
                  <TextInput
                    label={'min selection'}
                    required={true}
                    name={'min'}
                    type={'numeric'}
                    value={min}
                    onChangeHandler={onChange}
                    error={inputErrors.min}
                  />
                </div>
              )}
              <div className={`col ${optional ? '' : 'pl-h'}`.trim()}>
                <TextInput
                  label={'max selection'}
                  required={true}
                  name={'max'}
                  type={'numeric'}
                  value={max}
                  onChangeHandler={onChange}
                  error={inputErrors.max}
                />
              </div>
            </div>
          </article>
        )}

        {activeTab === 1 && (
          <Options
            options={options}
            formName={'options'}
            onChangeHandler={onChange}
          />
        )}
      </SideSheet.Content>
      <SideSheet.FooterButton
        text={'add'}
        requesting={requesting}
        form={'customisationAddForm'}
      />
    </SideSheet>
  );
};

CustomisationAdd.propTypes = {
  user: PropTypes.object,
  company: PropTypes.string,
};

export default CustomisationAdd;
