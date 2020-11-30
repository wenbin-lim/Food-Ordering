import React, { useEffect, useState, Fragment } from 'react';
import PropTypes from 'prop-types';
import { useDispatch } from 'react-redux';
import { useNavigate, useParams } from 'react-router-dom';

// Actions
import { setSnackbar } from '../../actions/app';

// Components
import SideSheet from '../layout/SideSheet';
import Tabs, { Tab } from '../layout/Tabs';
import TextInput from '../layout/TextInput';
import SwitchInput from '../layout/SwitchInput';
import Options from './options/Options';

// Custom Hooks
import useErrors from '../../hooks/useErrors';
import useGetOne from '../../query/hooks/useGetOne';
import usePut from '../../query/hooks/usePut';

const CustomisationEdit = ({ user }) => {
  let { id } = useParams();
  const navigate = useNavigate();
  const dispatch = useDispatch();
  const [activeTab, setActiveTab] = useState(0);
  const onClickTab = tabIndex => setActiveTab(tabIndex);

  const { data: customisation, isLoading, error } = useGetOne(
    'customisation',
    id,
    {
      route: `/api/customisations/${id}`,
    }
  );
  useErrors(error);

  const [
    editCustomisation,
    { isLoading: requesting, error: editErrors },
  ] = usePut('customisations', { route: `/api/customisations/${id}` });
  const [inputErrors] = useErrors(editErrors, ['name', 'title', 'min', 'max']);

  const [formData, setFormData] = useState({
    name: '',
    title: '',
    availability: true,
    optional: false,
    min: '1',
    max: '1',
    options: [],
  });

  const { name, title, availability, optional, min, max, options } = formData;

  useEffect(() => {
    if (customisation) {
      const {
        name,
        title,
        availability,
        optional,
        min,
        max,
        options,
      } = customisation;

      setFormData({
        name: name ? name : '',
        title: title ? title : '',
        availability: typeof availability === 'boolean' ? availability : true,
        optional: typeof optional === 'boolean' ? optional : true,
        min: typeof min === 'number' ? min.toString() : '1',
        max: typeof max === 'number' ? max.toString() : '1',
        options: Array.isArray(options) ? options : [],
      });
    }
  }, [isLoading, customisation]);

  const onChange = ({ name, value }) =>
    setFormData({ ...formData, [name]: value });

  const onSubmit = async e => {
    e.preventDefault();

    const editCustomisationSuccess = await editCustomisation(formData);

    return (
      editCustomisationSuccess &&
      dispatch(setSnackbar(`Edited customisation of name '${name}'`, 'success'))
    );
  };

  return (
    <SideSheet wrapper={false}>
      <SideSheet.Header
        title={'Edit Customisation'}
        closeHandler={() => navigate('../')}
      >
        <Tabs onClickTab={onClickTab} justifyTab='center'>
          <Tab name={'Main'} />
          <Tab name={'Options'} />
        </Tabs>
      </SideSheet.Header>
      <SideSheet.Content
        elementType={'form'}
        id={'customisationEditForm'}
        onSubmit={onSubmit}
      >
        {activeTab === 0 && (
          <article>
            <SwitchInput
              label={'Availability'}
              name={'availability'}
              value={availability}
              onChangeHandler={onChange}
            />

            {user.access > 2 && (
              <Fragment>
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
              </Fragment>
            )}
          </article>
        )}

        {activeTab === 1 && (
          <Options
            options={options}
            allowAddOption={user.access > 2 ? true : false}
            allowDeleteOption={user.access > 2 ? true : false}
            allowEditOptionNameAndPrice={user.access > 2 ? true : false}
            formName={'options'}
            onChangeHandler={onChange}
          />
        )}
      </SideSheet.Content>
      <SideSheet.FooterButton
        text={'edit'}
        requesting={requesting}
        form={'customisationEditForm'}
      />
    </SideSheet>
  );
};

CustomisationEdit.propTypes = {
  user: PropTypes.object,
};

export default CustomisationEdit;
