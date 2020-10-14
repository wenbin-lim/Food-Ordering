import React, { useState } from 'react';
import PropTypes from 'prop-types';
import { connect } from 'react-redux';
import { useNavigate } from 'react-router-dom';

// Actions
import { addTable } from '../../actions/tables';

// Components
import Header from '../layout/Header';
import Spinner from '../layout/Spinner';
import TextInput from '../layout/TextInput';
import Button from '../layout/Button';

// Icons
import ArrowIcon from '../icons/ArrowIcon';

// Custom Hooks
import useInputError from '../../hooks/useInputError';

/* 
  =====
  Props
  =====
  @name       auth 
  @type       object
  @desc       app level auth state from Route
  @required   true

  @name       companies 
  @type       object
  @desc       app level companies state
  @required   true

  @name       tables 
  @type       object
  @desc       app level tables state
  @required   true

  @name       addTable 
  @type       function
  @desc       action to add new company to db
  @required   true
*/
const TableAdd = ({
  auth: { access: authAccess, company: authCompany },
  companies: { company },
  tables: { tableLoading, tableErrors },
  addTable,
}) => {
  const initialInputErrorMessagesState = {
    name: '',
  };

  const [inputErrorMessages] = useInputError(
    initialInputErrorMessagesState,
    tableErrors
  );

  // Component state to change input field values
  const [formData, setFormData] = useState({
    name: '',
  });

  const { name } = formData;

  const onChange = ({ name, value }) => {
    setFormData({ ...formData, [name]: value });
  };

  const navigate = useNavigate();

  const onSubmit = async e => {
    e.preventDefault();

    let newTable = formData;
    let companyId = authCompany._id;

    if (authAccess === 99 && company) {
      companyId = company._id;
    }

    const addTableSuccess = await addTable(companyId, newTable);

    if (addTableSuccess) {
      navigate('../');
    }
  };

  return (
    <div
      style={{
        height: '100%',
        display: 'grid',
        gridTemplateRows: 'auto 1fr auto',
        overflow: 'hidden',
      }}
    >
      <Header title={'Add Table'} closeActionCallback={'../'} />

      <form
        id='tableAddForm'
        style={{ padding: '1rem 2rem', overflowY: 'auto' }}
        onSubmit={e => onSubmit(e)}
      >
        <TextInput
          label={'name'}
          showRequiredInLabel={true}
          name={'name'}
          type={'text'}
          value={name}
          onChangeHandler={onChange}
          validity={!inputErrorMessages.name}
          errorMessage={inputErrorMessages.name}
        />

        {inputErrorMessages.noParam && (
          <div className='alert alert-small alert-error'>
            {inputErrorMessages.noParam}
          </div>
        )}
      </form>

      <Button
        btnStyle={'contained'}
        type={'primary'}
        block={true}
        fixBlockBtnBottom={true}
        text={'Add'}
        icon={
          !tableLoading ? (
            <ArrowIcon direction='right' />
          ) : (
            <Spinner height={'1.5rem'} />
          )
        }
        submit={true}
        form={'tableAddForm'}
        disabled={tableLoading}
      />
    </div>
  );
};

TableAdd.propTypes = {
  auth: PropTypes.object.isRequired,
  tables: PropTypes.object.isRequired,
  companies: PropTypes.object.isRequired,
  addTable: PropTypes.func.isRequired,
};

const mapStateToProps = state => ({
  tables: state.tables,
  companies: state.companies,
});

const mapDispatchToProps = {
  addTable,
};

export default connect(mapStateToProps, mapDispatchToProps)(TableAdd);
