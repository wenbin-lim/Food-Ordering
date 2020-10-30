import React, { useState, useRef, Fragment } from 'react';
import PropTypes from 'prop-types';

// Components
import Button from '../../layout/Button';
import Dialog from '../../layout/Dialog';
import TextInput from '../../layout/TextInput';
import SwitchInput from '../../layout/SwitchInput';
import OptionItem from './OptionItem';

// Icons
import ArrowIcon from '../../icons/ArrowIcon';
import PlusIcon from '../../icons/PlusIcon';

// Misc
import { v4 as uuid } from 'uuid';

const Options = ({ options, editable = true, formName, onChangeHandler }) => {
  const [showDialog, setShowDialog] = useState(false);
  const dialogRef = useRef(null);

  const initialFormData = {
    _id: uuid(),
    name: '',
    price: '',
    availability: true,
  };

  const [formData, setFormData] = useState(initialFormData);

  const { name, price, availability } = formData;

  const onChange = ({ name, value }) =>
    setFormData({ ...formData, [name]: value });

  const initialErrors = {
    name: '',
    price: '',
  };

  const [errors, setErrors] = useState(initialErrors);

  const onSubmit = async e => {
    e.preventDefault();

    let newErrors = { ...initialErrors };
    let validate = true;

    if (!name) {
      newErrors.name = 'Please enter a name';
      validate = false;
    }
    if (!price) {
      newErrors.price = 'Please enter a price';
      validate = false;
    }

    if (validate) {
      const dialog = dialogRef.current;

      if (dialog) {
        const dialogTlm = dialog.tlm;

        dialogTlm.eventCallback('onReverseComplete', () => {
          setShowDialog(false);

          if (options.find(option => option._id === formData._id)) {
            onChangeHandler({
              name: formName,
              value: options.map(option =>
                option._id === formData._id ? formData : option
              ),
            });
          } else {
            onChangeHandler({ name: formName, value: [...options, formData] });
          }
        });
        dialogTlm.reverse();
      }
    } else {
      setErrors({ ...newErrors });
    }
  };

  const form = (
    <Fragment>
      <form id='optionForm' className='optionform-content'>
        <div className='row'>
          <div className='col'>
            <TextInput
              label={'name'}
              required={true}
              name={'name'}
              type={'text'}
              value={name}
              onChangeHandler={onChange}
              error={errors.name}
            />
          </div>
        </div>

        <div className='row'>
          <div className='col'>
            <TextInput
              label={'price'}
              required={true}
              name={'price'}
              type={'number'}
              value={price}
              onChangeHandler={onChange}
              error={errors.price}
            />
          </div>
        </div>

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
      </form>

      <Button
        fill={'contained'}
        type={'primary'}
        block={true}
        blockBtnBottom={true}
        icon={<ArrowIcon direction={'right'} />}
        text={'Submit'}
        submit={true}
        form={'optionForm'}
        onClick={onSubmit}
      />
    </Fragment>
  );

  const showOptionForm = (option = initialFormData) => {
    const { price } = option;
    setFormData({
      ...option,
      price: typeof price === 'number' ? price.toString() : price,
    });
    setShowDialog(true);
  };

  const deleteOption = deletedOption =>
    onChangeHandler({
      name: formName,
      value: options.filter(option => option._id !== deletedOption._id),
    });

  return (
    <article className='list-wrapper'>
      <header className='list-header'>
        {editable ? (
          <Button
            classes={'list-header-right-content'}
            fill={'contained'}
            type={'secondary'}
            icon={<PlusIcon />}
            text={'option'}
            leadingIcon={true}
            small={true}
            onClick={() => showOptionForm()}
          />
        ) : (
          <h3 className='list-header-left-content heading-3'>Options</h3>
        )}
      </header>
      <article className='list p-h'>
        {options.length > 0 ? (
          options.map(option => (
            <OptionItem
              key={option._id}
              option={option}
              actions={
                editable
                  ? [
                      {
                        name: 'Edit',
                        callback: () => showOptionForm(option),
                      },
                      {
                        name: 'Delete',
                        callback: () => deleteOption(option),
                      },
                    ]
                  : null
              }
            />
          ))
        ) : (
          <p className='caption text-center'>No options</p>
        )}
      </article>
      {editable && showDialog && (
        <Dialog
          ref={dialogRef}
          classes={'optionform'}
          content={form}
          unmountDialogHandler={() => setShowDialog(false)}
        />
      )}
    </article>
  );
};

Options.propTypes = {
  options: PropTypes.array.isRequired,
  editable: PropTypes.bool,
  formName: PropTypes.string,
  onChangeHandler: PropTypes.func,
};

export default Options;
