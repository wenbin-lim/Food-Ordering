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
  userAccess,
  userCompanyId,
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

    if (userAccess === 99 && !company)
      return setSnackbar('Select a company first!', 'error');

    let companyId = company && userAccess === 99 ? company._id : userCompanyId;

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
  userAccess: PropTypes.number.isRequired,
  userCompanyId: PropTypes.string.isRequired,
  companies: PropTypes.object.isRequired,
  tables: PropTypes.object.isRequired,
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
