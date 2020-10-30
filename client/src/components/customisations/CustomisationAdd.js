import React, { useState, Fragment } from 'react';
import PropTypes from 'prop-types';
import { connect } from 'react-redux';
import { useNavigate } from 'react-router-dom';

// Actions
import { addCustomisation } from '../../actions/customisations';
import { setSnackbar } from '../../actions/app';

// Components
import SideSheet from '../layout/SideSheet';
import Tabs from '../layout/Tabs';
import Spinner from '../layout/Spinner';
import TextInput from '../layout/TextInput';
import Button from '../layout/Button';
import RadioInput from '../layout/RadioInput';
import SwitchInput from '../layout/SwitchInput';
import Options from './options/Options';

// Icons
import ArrowIcon from '../icons/ArrowIcon';

// Custom Hooks
import useInputError from '../../hooks/useInputError';

const CustomisationAdd = ({
  auth: { access: authAccess, company: authCompany },
  companies: { company },
  customisations: { requesting, errors },
  addCustomisation,
  setSnackbar,
}) => {
  const [inputErrorMessages] = useInputError(
    {
      name: '',
      title: '',
      min: '',
      max: '',
    },
    errors
  );

  const [formData, setFormData] = useState({
    name: '',
    title: '',
    availability: true,
    selection: 'nolimit',
    min: '0',
    max: '0',
    options: [],
  });

  let { name, title, availability, selection, min, max, options } = formData;

  const onChange = ({ name, value }) => {
    setFormData({ ...formData, [name]: value });
  };

  const navigate = useNavigate();

  const onSubmit = async e => {
    e.preventDefault();

    if (authAccess === 99 && !company)
      return setSnackbar('Select a company first!', 'error');

    let companyId =
      company && authAccess === 99 ? company._id : authCompany._id;

    const addCustomisationSuccess = await addCustomisation(companyId, formData);

    return addCustomisationSuccess && closeSideSheet();
  };

  const closeSideSheet = () => navigate('../');

  const tabPageOne = (
    <Fragment>
      <div className='row'>
        <div className='col'>
          <SwitchInput
            label={'availability'}
            name={'availability'}
            value={availability}
            onChangeHandler={onChange}
          />
        </div>
      </div>

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
          <TextInput
            label={'title'}
            required={true}
            name={'title'}
            type={'text'}
            value={title}
            onChangeHandler={onChange}
            error={inputErrorMessages.title}
          />
        </div>
      </div>

      <div className='row'>
        <div className='col'>
          <RadioInput
            label={'Option selection type'}
            required={true}
            name={'selection'}
            inputs={[
              {
                key: 'No limit',
                value: 'nolimit',
              },
              {
                key: 'Min',
                value: 'min',
              },
              {
                key: 'Max',
                value: 'max',
              },
              {
                key: 'Range',
                value: 'range',
              },
            ]}
            value={selection}
            onChangeHandler={onChange}
          />
        </div>
      </div>

      {selection !== 'nolimit' && (
        <div className='row'>
          {(selection === 'range' || selection === 'min') && (
            <div
              className={`col ${selection === 'range' ? 'pr-h' : ''}`.trim()}
            >
              <TextInput
                label={'min selection'}
                required={true}
                name={'min'}
                type={'numeric'}
                value={min}
                onChangeHandler={onChange}
                error={inputErrorMessages.min}
              />
            </div>
          )}

          {(selection === 'range' || selection === 'max') && (
            <div
              className={`col ${selection === 'range' ? 'pl-h' : ''}`.trim()}
            >
              <TextInput
                label={'max selection'}
                required={true}
                name={'max'}
                type={'numeric'}
                value={max}
                onChangeHandler={onChange}
                error={inputErrorMessages.max}
              />
            </div>
          )}
        </div>
      )}
    </Fragment>
  );

  const tabPageTwo = (
    <Options
      options={options}
      formName={'options'}
      onChangeHandler={onChange}
    />
  );

  const sideSheetContent = (
    <form
      id='customisationAddForm'
      className='sidesheet-content tabs-wrapper p-0'
      onSubmit={onSubmit}
    >
      <Tabs
        wrapper={false}
        headerClass={'mt-1 ml-1 mr-1 mb-0'}
        tabs={[
          { name: 'Main', content: tabPageOne, class: 'p-1' },
          { name: 'Options', content: tabPageTwo, class: 'p-1' },
        ]}
      />
    </form>
  );

  return (
    <SideSheet
      wrapper={false}
      headerTitle={'Add Customisation'}
      closeSideSheetHandler={closeSideSheet}
      contentWrapper={false}
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
          form={'customisationAddForm'}
        />
      }
    />
  );
};

CustomisationAdd.propTypes = {
  auth: PropTypes.object.isRequired,
  customisations: PropTypes.object.isRequired,
  companies: PropTypes.object.isRequired,
  addCustomisation: PropTypes.func.isRequired,
  setSnackbar: PropTypes.func.isRequired,
};

const mapStateToProps = state => ({
  customisations: state.customisations,
  companies: state.companies,
});

const mapDispatchToProps = {
  addCustomisation,
  setSnackbar,
};

export default connect(mapStateToProps, mapDispatchToProps)(CustomisationAdd);
