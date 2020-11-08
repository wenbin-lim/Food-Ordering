import React, { useEffect, useState } from 'react';
import PropTypes from 'prop-types';
import { connect } from 'react-redux';
import { useParams, useNavigate } from 'react-router-dom';

// Actions
import { getTable, editTable } from '../../actions/tables';

// Components
import SideSheet from '../layout/SideSheet';
import Spinner from '../layout/Spinner';
import TextInput from '../layout/TextInput';
import Button from '../layout/Button';

// Icons
import ArrowIcon from '../icons/ArrowIcon';

// Custom Hooks
import useInputError from '../../hooks/useInputError';

const TableEdit = ({
  tables: { requesting, table, errors },
  getTable,
  editTable,
}) => {
  let { id } = useParams();

  useEffect(() => {
    getTable(id);

    // eslint-disable-next-line
  }, [id]);

  const [inputErrorMessages] = useInputError({ name: '' }, errors);

  const [formData, setFormData] = useState({
    name: '',
  });

  const { name } = formData;

  useEffect(() => {
    const { _id: tableId, name } = { ...table };

    if (tableId === id) {
      setFormData({
        name: name ? name : '',
      });
    }
  }, [table, id]);

  const onChange = ({ name, value }) =>
    setFormData({ ...formData, [name]: value });

  const navigate = useNavigate();

  const onSubmit = async e => {
    e.preventDefault();

    const editTableSuccess = await editTable(id, formData);

    return editTableSuccess && navigate('../');
  };

  const closeSideSheet = () => navigate('../../');

  const sideSheetContent = (
    <form id='tableEditForm' onSubmit={onSubmit}>
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
      headerTitle={'Edit Table'}
      closeSideSheetHandler={closeSideSheet}
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
          form={'tableEditForm'}
        />
      }
    />
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
