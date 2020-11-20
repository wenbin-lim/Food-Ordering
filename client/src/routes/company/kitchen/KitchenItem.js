import React, { useState, useEffect, useRef } from 'react';
import PropTypes from 'prop-types';

// Components
import KitchenOrderItem from './KitchenOrderItem';

const KitchenItem = ({ kitchenOrder }) => {
  const { bill, orders } = kitchenOrder;
  const { table } = { ...bill };
  const { name: tableName } = { ...table };

  return (
    <article className='kitchenitem'>
      <header className='kitchenitem-header'>
        <h3 className='kitchenitem-table-name'>
          Table {tableName ? tableName : ''}
        </h3>
      </header>
      <section className='kitchenitem-orders'>
        {Array.isArray(orders) &&
          orders.map(order => (
            <KitchenOrderItem key={order._id} order={order} />
          ))}
      </section>
    </article>
  );
};

KitchenItem.propTypes = {
  kitchenOrder: PropTypes.object,
};

export default KitchenItem;
