import React, { useState, useEffect } from 'react';
import { useDispatch } from 'react-redux';

// Actions
import { setSnackbar } from '../../actions/app';

// Components
import Container from '../layout/Container';
import Tabs, { Tab } from '../layout/Tabs';
import List from '../layout/List';
import FormDialog from '../layout/FormDialog';
import Dropdown from '../layout/Dropdown';
import TextInput from '../layout/TextInput';
import Spinner from '../layout/Spinner';
import Button from '../layout/Button';
import OrderItem from '../orders/OrderItem';

// Icons
import ArrowIcon from '../icons/ArrowIcon';

// Hooks
import useGet from '../../query/hooks/useGet';
import usePut from '../../query/hooks/usePut';
import usePost from '../../query/hooks/usePost';
import useErrors from '../../hooks/useErrors';

const Cart = ({ user, companyDetails }) => {
  const dispatch = useDispatch();

  const [activeTab, setActiveTab] = useState(0);
  const onClickTab = tabIndex => setActiveTab(tabIndex);

  const [cartPrice, setCartPrice] = useState(0);
  const [currentCartOrders, setCurrentCartOrders] = useState([]);
  const [confirmedOrders, setConfirmedOrders] = useState([]);

  const [showBillDialog, setShowBillDialog] = useState(false);
  const { acceptedPaymentMethods } = companyDetails;

  const [billData, setBillData] = useState({
    paymentMethod:
      Array.isArray(acceptedPaymentMethods) &&
      acceptedPaymentMethods.length > 0 &&
      acceptedPaymentMethods[0],
    discountCode: '',
  });

  const { paymentMethod, discountCode } = billData;

  const onChange = ({ name, value }) =>
    setBillData({ ...billData, [name]: value });

  const {
    data: orders,
    isLoading: ordersLoading,
    error: ordersError,
  } = useGet('orders', { route: `/api/orders` });
  useErrors(ordersError);

  const [
    checkoutOrders,
    { isLoading: checkoutRequesting, error: checkoutErrors },
  ] = usePut('orders', {
    route: '/api/orders',
  });
  useErrors(checkoutErrors);

  const [
    billOrders,
    { isLoading: billOrdersRequesting, error: billOrdersError },
  ] = usePut('bills', {
    route: `/api/bills/${user?._id}`,
  });
  const [inputErrors] = useErrors(billOrdersError, ['discountCode']);

  const [sendNotification, { error: addError }] = usePost('notifications', {
    route: `/api/notifications`,
  });
  useErrors(addError);

  useEffect(() => {
    if (orders) {
      const newCurrentCartOrders = orders.filter(
        ({ currentStatus }) => currentStatus === 'new'
      );

      const newConfirmedOrders = orders.filter(
        ({ currentStatus }) => currentStatus !== 'new'
      );

      setCurrentCartOrders(newCurrentCartOrders);
      setConfirmedOrders(newConfirmedOrders);

      const newCurrentCartPrice = newCurrentCartOrders.reduce(
        (result, item) => (result += item.price),
        0
      );

      const newAllOrdersPrice = newConfirmedOrders.reduce(
        (result, item) => (result += item.price),
        0
      );

      if (activeTab === 0) {
        setCartPrice(newCurrentCartPrice);
      } else if (activeTab === 1) {
        setCartPrice(newAllOrdersPrice);
      }
    }

    // eslint-disable-next-line
  }, [activeTab, ordersLoading, orders]);

  const onClickFooterBtn = async () => {
    if (activeTab === 0 && currentCartOrders.length > 0) {
      const checkoutOrdersSuccess = await checkoutOrders({
        editType: 'confirmingOrders',
        orders: currentCartOrders,
      });

      if (checkoutOrdersSuccess) {
        dispatch(setSnackbar(checkoutOrdersSuccess, 'success'));
      }
    } else if (activeTab === 1 && confirmedOrders.length > 0) {
      setShowBillDialog(true);
    }
  };

  const onSubmitBill = async e => {
    e.preventDefault();

    const billSuccess = await billOrders({
      ...billData,
      status: 'ready',
    });

    if (billSuccess) {
      dispatch(setSnackbar('Bill sent!', 'success'));

      await sendNotification({
        type: 'billReady',
        forWho: ['waiter', 'cashier', 'admin'],
        tableName: user?.table?.name,
        remarks: 'Ready for bill',
      });
    }

    return billSuccess;
  };

  /* can do feedback here after pressing bill button */

  return (
    <Container className='cart'>
      <Tabs className='cart-tabs mb-1' onClickTab={onClickTab}>
        <Tab name='Current Cart' />
        <Tab name='All Orders' />
      </Tabs>

      <List className='cart-list' enableSearch={false}>
        <List.Items
          loading={ordersLoading}
          array={activeTab === 0 ? currentCartOrders : confirmedOrders}
          itemElement={<OrderItem accessRole='customer' />}
        />
      </List>

      <footer className='cart-footer'>
        <h2 className='cart-price'>${cartPrice.toFixed(2)}</h2>
        <Button
          className='cart-footer-btn'
          text={activeTab === 0 ? 'Checkout' : 'Bill'}
          icon={
            activeTab === 0 ? (
              checkoutRequesting ? (
                <Spinner height='1.5rem' />
              ) : (
                <ArrowIcon direction='right' />
              )
            ) : billOrdersRequesting ? (
              <Spinner height='1.5rem' />
            ) : (
              <ArrowIcon direction='right' />
            )
          }
          ripple={false}
          onClick={onClickFooterBtn}
        />
      </footer>

      {showBillDialog && (
        <FormDialog
          elementType='article'
          title='Bill Details'
          onCloseFormDialog={() => setShowBillDialog(false)}
          onSubmit={onSubmitBill}
          style={{
            height: '400px',
          }}
        >
          {Array.isArray(acceptedPaymentMethods) &&
            acceptedPaymentMethods.length > 0 && (
              <Dropdown
                label='Payment Method'
                name='paymentMethod'
                options={acceptedPaymentMethods.map(paymentMethod => ({
                  key: paymentMethod.toUpperCase(),
                  value: paymentMethod,
                }))}
                value={paymentMethod}
                onChangeHandler={onChange}
                size={3}
              />
            )}
          <TextInput
            label='Discount Code'
            name='discountCode'
            type='text'
            value={discountCode}
            onChangeHandler={onChange}
            error={inputErrors.discountCode}
          />
        </FormDialog>
      )}
    </Container>
  );
};

export default Cart;
