import React, { useEffect, useState } from 'react';
import PropTypes from 'prop-types';
import { connect } from 'react-redux';
import { useParams, useNavigate } from 'react-router-dom';

// Actions
import { getTable, editTable } from '../../actions/tables';

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
  @name       tables
  @type       array of table object
  @desc       app level tables state
  @desc       only require the errors(for checking form submission) and loading(check if form is submitted)
  @required   true

  @name       getTable
  @type       function
  @desc       Redux action to set table in app level tables state
  @required   true

  @name       editTable
  @type       function
  @desc       Redux action to update the table in DB and app level tables state
  @required   true
  @default    none
*/
const TableEdit = ({
  tables: { table, tableLoading, tableErrors },
  getTable,
  editTable,
}) => {
  let { id } = useParams();

  useEffect(() => {
    getTable(id);
  }, [id]);

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

  useEffect(() => {
    if (table) {
      setFormData({
        ...formData,
        name: table.name ? table.name : '',
      });
    }
  }, [table]);

  const onChange = ({ name, value }) => {
    setFormData({ ...formData, [name]: value });
  };

  const navigate = useNavigate();

  const onSubmit = async e => {
    e.preventDefault();

    let newTable = formData;

    const editTableSuccess = await editTable(id, newTable);

    if (editTableSuccess) {
      navigate('../');
    }
  };

  return (
    <div
      style={{
        height: '100%',
        display: 'grid',
        gridTemplateRows: 'auto 1fr auto',
      }}
    >
      <Header title={'Table Edit'} closeActionCallback={'../../'} />

      {table && (
        <form
          id='tableEditForm'
          style={{ padding: '1rem 2rem', overflowY: 'auto' }}
          onSubmit={onSubmit}
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
      )}
      <Button
        btnStyle={'contained'}
        type={'primary'}
        block={true}
        fixBlockBtnBottom={true}
        text={'Edit'}
        icon={
          !tableLoading ? (
            <ArrowIcon direction='right' />
          ) : (
            <Spinner height={'1.5rem'} />
          )
        }
        submit={true}
        form={'tableEditForm'}
        disabled={tableLoading}
      />
    </div>
  );
};

TableEdit.propTypes = {
  tables: PropTypes.object.isRequired,
  getTable: PropTypes.func.isRequired,
  editTable: PropTypes.func.isRequired,
};

const mapStateToProps = state => ({
  tables: state.tables,
});

const mapDispatchToProps = {
  getTable,
  editTable,
};

export default connect(mapStateToProps, mapDispatchToProps)(TableEdit);
