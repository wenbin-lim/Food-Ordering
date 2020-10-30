import React, { useState } from 'react';
import PropTypes from 'prop-types';
import { connect } from 'react-redux';
import { useNavigate } from 'react-router-dom';

// Actions
import { addTable } from '../../actions/tables';
import { setSnackbar } from '../../actions/app';

// Components
import SideSheet from '../layout/SideSheet';
import Spinner from '../layout/Spinner';
import TextInput from '../layout/TextInput';
import Button from '../layout/Button';

// Icons
import ArrowIcon from '../icons/ArrowIcon';

// Custom Hooks
import useInputError from '../../hooks/useInputError';

const TableAdd = ({
  auth: { access: authAccess, company: authCompany },
  companies: { company },
  tables: { requesting, errors },
  addTable,
  setSnackbar,
}) => {
  const [inputErrorMessages] = useInputError({ name: '' }, errors);

  const [formData, setFormData] = useState({
    name: '',
  });

  const { name } = formData;

  const onChange = ({ name, value }) =>
    setFormData({ ...formData, [name]: value });

  const navigate = useNavigate();

  const onSubmit = async e => {
    e.preventDefault();

    if (authAccess === 99 && !company)
      return setSnackbar('Select a company first!', 'error');

    let companyId =
      company && authAccess === 99 ? company._id : authCompany._id;

    const addTableSuccess = await addTable(companyId, formData);

    return addTableSuccess && closeSideSheet();
  };

  const closeSideSheet = () => navigate('../');

  const sideSheetContent = (
    <form id='tableAddForm' onSubmit={onSubmit}>
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
    </form>
  );

  return (
    <SideSheet
      wrapper={false}
      headerTitle={'Add Table'}
      closeSideSheetHandler={closeSideSheet}
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
          form={'tableAddForm'}
        />
      }
    />
  );
};

TableAdd.propTypes = {
  auth: PropTypes.object.isRequired,
  tables: PropTypes.object.isRequired,
  companies: PropTypes.object.isRequired,
  addTable: PropTypes.func.isRequired,
  setSnackbar: PropTypes.func.isRequired,
};

const mapStateToProps = state => ({
  tables: state.tables,
  companies: state.companies,
});

const mapDispatchToProps = {
  addTable,
  setSnackbar,
};

export default connect(mapStateToProps, mapDispatchToProps)(TableAdd);
