import React from 'react';
import PropTypes from 'prop-types';
import { useNavigate } from 'react-router-dom';

// Components
import ListItem from '../layout/ListItem';

const CashierItem = ({ bill }) => {
  const navigate = useNavigate();

  const { _id: billId, table, status, paymentMethod, discountCode } = bill;
  const { name } = { ...table };

  return (
    <ListItem
      className='cashieritem'
      onClick={() => status === 'ready' && navigate(billId)}
    >
      <ListItem.Before>
        <div
          className={`cashieritem-status ${
            status === 'ready'
              ? 'cashieritem-status-success'
              : 'cashieritem-status-surface2'
          }`}
        />
      </ListItem.Before>
      <ListItem.Content className='cashieritem-content'>
        <p className='cashieritem-table-name'>Table {name}</p>
        {bill?.status === 'ready' && <p className='body-2'>Ready for bill</p>}
        {bill?.status !== 'ready' && <p className='body-2'>Not Ready</p>}

        <div className='cashieritem-paymentmethod'>
          <span>Preferred Payment</span>
          <span>{paymentMethod ? paymentMethod.toUpperCase() : '-'}</span>
        </div>
        <div className='cashieritem-discountcode'>
          <span>Discount Code</span>
          <span>{discountCode ? discountCode.toUpperCase() : '-'}</span>
        </div>
      </ListItem.Content>
    </ListItem>
  );
};

CashierItem.propTypes = {
  bill: PropTypes.object,
};

export default CashierItem;
