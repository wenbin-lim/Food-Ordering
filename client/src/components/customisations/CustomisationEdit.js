import React, { useEffect, useState, Fragment } from 'react';
import PropTypes from 'prop-types';
import { connect } from 'react-redux';
import { useParams, useNavigate } from 'react-router-dom';

// Actions
import {
  getCustomisation,
  editCustomisation,
} from '../../actions/customisations';

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

const CustomisationEdit = ({
  customisations: { requesting, customisation, errors },
  getCustomisation,
  editCustomisation,
}) => {
  let { id } = useParams();

  useEffect(() => {
    getCustomisation(id);

    // eslint-disable-next-line
  }, [id]);

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

  useEffect(() => {
    const {
      _id: customisationId,
      name,
      title,
      availability,
      selection,
      min,
      max,
      options,
    } = { ...customisation };

    if (customisationId === id) {
      setFormData({
        name: name ? name : '',
        title: title ? title : '',
        availability: typeof availability === 'boolean' ? availability : true,
        selection: selection ? selection : 'nolimit',
        min: typeof min === 'number' ? min.toString() : '0',
        max: typeof max === 'number' ? max.toString() : '0',
        options: Array.isArray(options) ? options : [],
      });
    }
  }, [customisation, id]);

  const onChange = ({ name, value }) =>
    setFormData({ ...formData, [name]: value });

  const navigate = useNavigate();

  const onSubmit = async e => {
    e.preventDefault();

    const editCustomisationSuccess = await editCustomisation(id, formData);

    return editCustomisationSuccess && navigate('../');
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
      id='customisationEditForm'
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
      headerTitle={'Edit Customisation'}
      closeSideSheetHandler={closeSideSheet}
      contentWrapper={false}
      content={sideSheetContent}
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
          form={'customisationEditForm'}
        />
      }
    />
  );
};

CustomisationEdit.propTypes = {
  customisations: PropTypes.object.isRequired,
  getCustomisation: PropTypes.func.isRequired,
  editCustomisation: PropTypes.func.isRequired,
};

const mapStateToProps = state => ({
  customisations: state.customisations,
});

const mapDispatchToProps = {
  getCustomisation,
  editCustomisation,
};

export default connect(mapStateToProps, mapDispatchToProps)(CustomisationEdit);
