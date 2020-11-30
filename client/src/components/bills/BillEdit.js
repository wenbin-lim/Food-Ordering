import React, { useState, useEffect, Fragment } from 'react';
import { useParams, useNavigate, useMatch } from 'react-router-dom';
import { useDispatch } from 'react-redux';

// Actions
import { setSnackbar } from '../../actions/app';

// Components
import SideSheet from '../layout/SideSheet';
import Spinner from '../layout/Spinner';
import Dropdown from '../layout/Dropdown';
import TextInput from '../layout/TextInput';
import Tabs, { Tab } from '../layout/Tabs';
import ActionSheet, { Action } from '../layout/ActionSheet';
import AddAdditionalItemDialog from '../orders/AddAdditionalItemDialog';
import Dialog from '../layout/Dialog';
import List from '../layout/List';
import FoodItem from '../foods/FoodItem';

import OrderItem from '../orders/OrderItem';

// Hooks
import useGetOne from '../../query/hooks/useGetOne';
import useGet from '../../query/hooks/useGet';
import usePut from '../../query/hooks/usePut';
import useErrors from '../../hooks/useErrors';

const BillEdit = ({ companyDetails }) => {
  const matchWaiter = useMatch('/:companyName/waiter/:id');
  const matchAdmin = useMatch('/:companyName/bills/:id/edit');

  const navigate = useNavigate();
  const dispatch = useDispatch();
  const [activeTab, setActiveTab] = useState(matchWaiter ? 1 : 0);
  const onClickTab = tabIndex => setActiveTab(tabIndex);
  const [showActionSheet, setShowActionSheet] = useState(false);
  const [showFoodListDialog, setShowFoodListDialog] = useState(false);
  const [
    showAddAdditionalItemDialog,
    setShowAddAdditionalItemDialog,
  ] = useState(false);

  let { id } = useParams();
  const {
    acceptedPaymentMethods,
    hasServiceCharge,
    gstRegistered,
    roundTotalPrice,
    roundDownTotalPrice,
    pricesIncludesGst,
    pricesIncludesServiceCharge,
  } = companyDetails;

  const {
    data: bill,
    isLoading: billLoading,
    error: billErrors,
  } = useGetOne('bills', id, { route: `/api/bills/${id}` });
  useErrors(billErrors);
  const { invoiceNo, table } = { ...bill };

  const {
    data: orders,
    isLoading: ordersLoading,
    error: ordersErrors,
    refetch,
  } = useGetOne('orders', id, {
    route: '/api/orders',
    params: { type: 'cashier', bill: id },
  });
  useErrors(ordersErrors);

  const {
    data: foods,
    isLoading: foodsLoading,
    error: foodsErrors,
  } = useGet('foods', { route: '/api/foods' });
  useErrors(foodsErrors);

  const [
    editBill,
    { isLoading: requesting, error: editErrors },
  ] = usePut('bills', { route: `/api/bills/${id}` });

  const snackbarActionSwitchFunc = actionName => {
    switch (actionName) {
      case 'refetch':
        return () => refetch();
      default:
        return () => {};
    }
  };

  const [inputErrors] = useErrors(editErrors, ['discount'], {
    snackbarActionSwitchFunc,
  });

  const [completeOrders, setCompleteOrders] = useState([]);
  const [uncompleteOrders, setUncompleteOrders] = useState([]);

  useEffect(() => {
    if (Array.isArray(orders)) {
      setCompleteOrders(
        orders
          .filter(
            ({ currentStatus }) =>
              currentStatus === 'served' ||
              currentStatus === 'cancelled' ||
              currentStatus === 'removed' ||
              (currentStatus === 'rejected' && matchWaiter ? true : false)
          )
          .sort((a, b) => {
            if (a.currentStatus === 'served' && b.currentStatus !== 'served') {
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
      );

      setUncompleteOrders(
        orders.filter(
          ({ currentStatus }) =>
            currentStatus === 'new' ||
            currentStatus === 'preparing' ||
            currentStatus === 'cooking' ||
            currentStatus === 'hold' ||
            currentStatus === 'updated' ||
            currentStatus === 'ready' ||
            (currentStatus === 'rejected'
              ? matchWaiter
                ? false
                : true
              : false)
        )
      );
    }

    // eslint-disable-next-line
  }, [orders]);

  const [billData, setBillData] = useState({
    paymentMethod: '',
    discountCode: '',
    subTotal: 0,
    total: 0,
    gst: 0,
    serviceCharge: 0,
    discount: '0',
    roundingAmt: 0,
  });

  // eslint-disable-next-line
  const {
    paymentMethod,
    discountCode,
    subTotal,
    total,
    gst,
    serviceCharge,
    discount,
    roundingAmt,
  } = billData;

  const onChange = ({ name, value }) =>
    setBillData({ ...billData, [name]: value });

  useEffect(() => {
    if (bill && Array.isArray(orders)) {
      let validOrders = orders.filter(
        ({ currentStatus }) => currentStatus === 'served'
      );

      let newSubTotal = validOrders.reduce(
        (result, item) => (result += item.price),
        0
      );

      let newTotal = newSubTotal;

      // account for discount
      newTotal -= parseFloat(discount ? discount : 0);

      // account for service charge since service charge is also gst chargeable
      let newServiceCharge = 0;

      if (hasServiceCharge) {
        if (pricesIncludesServiceCharge) {
          newServiceCharge = newTotal * (10 / 110);
        } else {
          newServiceCharge = newTotal * 0.1;
          newTotal += newServiceCharge;
        }
      }

      // account for gst
      let newGst = 0;

      if (gstRegistered) {
        if (pricesIncludesGst) {
          newGst = newTotal * (7 / 107);
        } else {
          newGst = newTotal * 0.07;
          newTotal += newGst;
        }
      }

      // account for rounding amts, round to nearest 0.05 only
      let newRoundingAmt = 0;
      if (roundTotalPrice) {
        if (roundDownTotalPrice) {
          let newRoundedDownTotalPrice = Math.floor(newTotal * 20) / 20;
          newRoundingAmt = newTotal - newRoundedDownTotalPrice;
          newTotal = newRoundedDownTotalPrice;
        } else {
          let newRoundedUpTotalPrice = Math.ceil(newTotal * 20) / 20;
          newRoundingAmt = newRoundedUpTotalPrice - newTotal;
          newTotal = newRoundedUpTotalPrice;
        }
      }

      const {
        paymentMethod: newPaymentMethod,
        discountCode: newDiscountCode,
      } = bill;

      setBillData({
        ...billData,
        paymentMethod: newPaymentMethod ? newPaymentMethod : '',
        discountCode: newDiscountCode ? newDiscountCode : '',
        subTotal: Math.round((newSubTotal + Number.EPSILON) * 100) / 100,
        total: Math.round((newTotal + Number.EPSILON) * 100) / 100,
        serviceCharge:
          Math.round((newServiceCharge + Number.EPSILON) * 100) / 100,
        gst: Math.round((newGst + Number.EPSILON) * 100) / 100,
        roundingAmt: Math.round((newRoundingAmt + Number.EPSILON) * 100) / 100,
      });
    }

    // eslint-disable-next-line
  }, [bill, orders, discount]);

  const onSettleBill = async () => {
    // check if any orders are invalid
    if (uncompleteOrders.length > 0) {
      dispatch(
        setSnackbar('Uncomplete orders found, please rectify!', 'error')
      );
    } else {
      const editBillSucess = await editBill({
        ...billData,
        status: 'settled',
      });

      if (editBillSucess) {
        dispatch(setSnackbar('Successfully settled bill!', 'success'));
        navigate('../');
      }
    }
  };

  return (
    <Fragment>
      <SideSheet wrapper={false}>
        <SideSheet.Header
          title={matchAdmin ? invoiceNo : table?.name}
          closeHandler={() => navigate('../')}
          moreBtnActionHandler={() => setShowActionSheet(true)}
        >
          <Tabs
            initialActive={matchWaiter ? 2 : 0}
            onClickTab={onClickTab}
            justifyTab='center'
          >
            {!matchWaiter && <Tab name='Info' />}
            <Tab name='Uncomplete' />
            <Tab name='Complete' />
          </Tabs>
        </SideSheet.Header>
        {ordersLoading || billLoading ? (
          <Spinner />
        ) : (
          <SideSheet.Content>
            {activeTab === 0 && (
              <article>
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

                <hr className='mt-2 mb-2' />

                <div className='row'>
                  <p className='col-8 body-1'>Sub Total</p>
                  <p className='col body-1 text-right'>{`$${subTotal.toFixed(
                    2
                  )}`}</p>
                </div>

                <div className='row'>
                  <p className='col-8 body-1'>Discount</p>
                  <div className='col'>
                    <TextInput
                      name='discount'
                      type='number'
                      value={discount}
                      onChangeHandler={onChange}
                      error={inputErrors.discount}
                    />
                  </div>
                </div>

                <div className='row'>
                  <p className='col-8 body-1'>
                    Service Charge <small>( 10% )</small>
                  </p>
                  <span className='col body-1 text-right'>{`$${serviceCharge.toFixed(
                    2
                  )}`}</span>
                </div>

                <div className='row'>
                  <p className='col-8 body-1'>
                    GST <small>( 7% )</small>
                  </p>
                  <span className='col body-1 text-right'>{`$${gst.toFixed(
                    2
                  )}`}</span>
                </div>

                {roundTotalPrice && (
                  <div className='row'>
                    <p className='col-8 body-1'>Rounding</p>
                    <span className='col body-1 text-right'>
                      {`${
                        roundDownTotalPrice ? '-' : '+'
                      } $${roundingAmt.toFixed(2)}`}
                    </span>
                  </div>
                )}

                <hr className='mt-1' />

                <div className='row mb-2'>
                  <h3 className='col-8 heading-3'>Total</h3>
                  <h3 className='col heading-3 text-right'>{`$${total.toFixed(
                    2
                  )}`}</h3>
                </div>
              </article>
            )}

            {activeTab === 1 &&
              (Array.isArray(uncompleteOrders) &&
              uncompleteOrders.length > 0 ? (
                uncompleteOrders.map(order => (
                  <OrderItem
                    key={order._id}
                    accessRole={matchWaiter ? 'waiter' : 'cashier'}
                    data={order}
                  />
                ))
              ) : (
                <p className='caption text-center'>
                  No uncomplete orders found
                </p>
              ))}

            {activeTab === 2 &&
              (Array.isArray(completeOrders) && completeOrders.length > 0 ? (
                completeOrders.map(order => (
                  <OrderItem
                    key={order._id}
                    accessRole={matchWaiter ? 'waiter' : 'cashier'}
                    data={order}
                  />
                ))
              ) : (
                <p className='caption text-center'>No complete orders found</p>
              ))}
          </SideSheet.Content>
        )}

        {!matchWaiter && (
          <SideSheet.FooterButton
            text={matchAdmin ? 'Edit' : 'Bill'}
            onClick={onSettleBill}
            requesting={requesting}
          />
        )}
      </SideSheet>
      {showActionSheet && (
        <ActionSheet onCloseActionSheet={() => setShowActionSheet(false)}>
          <Action
            name='Add new food'
            onClick={() => setShowFoodListDialog(true)}
          />
          <Action
            name='New additional item'
            onClick={() => setShowAddAdditionalItemDialog(true)}
          />
        </ActionSheet>
      )}

      {showFoodListDialog && (
        <Dialog
          dialogElementType='article'
          className='foodlistdialog list-wrapper'
          onCloseDialog={() => setShowFoodListDialog(false)}
        >
          <List>
            <List.Items
              loading={foodsLoading}
              array={foods}
              itemElement={
                <FoodItem
                  editable={false}
                  showOrderDialogOnClick={true}
                  addToWhichBillId={id}
                />
              }
            />
          </List>
        </Dialog>
      )}

      {showAddAdditionalItemDialog && (
        <AddAdditionalItemDialog
          billId={id}
          onCloseAddAdditionalItemDialog={() =>
            setShowAddAdditionalItemDialog(false)
          }
        />
      )}
    </Fragment>
  );
};

BillEdit.propTypes = {};

export default BillEdit;
