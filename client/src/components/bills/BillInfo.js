import React, { useState } from 'react';
import { useParams, useNavigate } from 'react-router-dom';

// Components
import SideSheet from '../layout/SideSheet';
import Spinner from '../layout/Spinner';
import Tabs, { Tab } from '../layout/Tabs';
import List from '../layout/List';

import Receipt from './Receipt';
import OrderItem from '../orders/OrderItem';

// Hooks
import useGetOne from '../../query/hooks/useGetOne';
import useErrors from '../../hooks/useErrors';

const BillInfo = () => {
  let { id } = useParams();

  const navigate = useNavigate();
  const [activeTab, setActiveTab] = useState(0);
  const onClickTab = tabIndex => setActiveTab(tabIndex);

  const {
    data: bill,
    isLoading: billLoading,
    error: billErrors,
  } = useGetOne('bill', id, { route: `/api/bills/${id}` });
  useErrors(billErrors);

  const { status, invoiceNo, company: { companyCode } = {} } = { ...bill };

  const {
    data: orders,
    isLoading: ordersLoading,
    error: ordersErrors,
  } = useGetOne('orders', id, {
    route: '/api/orders',
    params: { bill: id },
  });
  useErrors(ordersErrors);

  return (
    <SideSheet wrapper={false}>
      <SideSheet.Header
        title={invoiceNo ? `${companyCode}${invoiceNo}` : ''}
        closeHandler={() => navigate('../')}
      >
        <Tabs onClickTab={onClickTab} justifyTab='center'>
          <Tab name='Receipt' />
          <Tab name='Orders' />
        </Tabs>
      </SideSheet.Header>

      <SideSheet.Content>
        {activeTab === 0 &&
          (billLoading ? (
            <Spinner />
          ) : status === 'settled' ? (
            <Receipt billId={id} companyCode={companyCode} />
          ) : (
            <p className='caption text-center'>Bill not settled</p>
          ))}

        {activeTab === 1 && (
          <List enableSearch={false}>
            <List.Items
              loading={ordersLoading}
              array={
                Array.isArray(orders)
                  ? orders.sort((a, b) => {
                      if (
                        a.currentStatus === 'served' &&
                        b.currentStatus !== 'served'
                      ) {
                        return -1;
                      } else if (
                        a.currentStatus !== 'served' &&
                        b.currentStatus === 'served'
                      ) {
                        return 1;
                      } else {
                        return 0;
                      }
                    })
                  : []
              }
              itemElement={<OrderItem accessRole='admin' editable={false} />}
            />
          </List>
        )}
      </SideSheet.Content>
    </SideSheet>
  );
};

export default BillInfo;
