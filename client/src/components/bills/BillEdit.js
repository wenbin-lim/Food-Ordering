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

const BillEdit = () => {
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
    data: bill,
    isLoading: billLoading,
    error: billErrors,
  } = useGetOne('bills', id, { route: `/api/bills/${id}` });
  useErrors(billErrors);
  const { invoiceNo, table, company } = { ...bill };
  const {
    _id: companyId,
    acceptedPaymentMethods,
    hasServiceCharge,
    gstRegistered,
    roundTotalPrice,
    roundDownTotalPrice,
    pricesIncludesGst,
    pricesIncludesServiceCharge,
    companyCode,
  } = { ...company };

  const {
    data: orders,
    isLoading: ordersLoading,
    error: ordersErrors,
    refetch,
  } = useGetOne('orders', id, {
    route: '/api/orders',
    params: {
      type: 'cashier',
      bill: id,
      company: companyId,
    },
    enabled: !billLoading,
  });
  useErrors(ordersErrors);

  const { data: availableDiscounts, error: discountsErrors } = useGet(
    'discounts',
    {
      route: '/api/discounts',
      params: { company: companyId },
      enabled: !billLoading,
    }
  );
  useErrors(discountsErrors);

  const { data: foods, isLoading: foodsLoading, error: foodsErrors } = useGet(
    'foods',
    {
      route: '/api/foods',
      params: { company: companyId },
      enabled: !billLoading,
    }
  );
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
  const [discountCodeError, setDiscountCodeError] = useState('');

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
    paymentMethod: 'master',
    discountCode: '',
  });

  const { paymentMethod, discountCode } = billData;

  const onChange = ({ name, value }) =>
    setBillData({ ...billData, [name]: value });

  const [billPrices, setBillPrices] = useState({
    subTotal: 0,
    total: 0,
    gst: 0,
    serviceCharge: 0,
    discount: '0',
    discountCodeValue: 0,
    roundingAmt: 0,
  });

  const {
    subTotal,
    total,
    gst,
    serviceCharge,
    discount,
    discountCodeValue,
    roundingAmt,
  } = billPrices;

  useEffect(() => {
    // initial loading of bill and orders
    if (!billLoading) {
      // set payment method and discountCode
      if (bill) {
        const {
          paymentMethod: preferredPaymentMethod,
          discountCode: discountCodeUsedByCustomer,
        } = bill;

        setBillData({
          paymentMethod: preferredPaymentMethod,
          discountCode:
            Array.isArray(discountCodeUsedByCustomer) &&
            discountCodeUsedByCustomer.length > 0
              ? discountCodeUsedByCustomer[0]._id
              : '',
        });
      }
    }

    // eslint-disable-next-line
  }, [billLoading]);

  useEffect(() => {
    if (bill && Array.isArray(orders) && Array.isArray(availableDiscounts)) {
      let validOrders = orders.filter(
        ({ currentStatus }) => currentStatus === 'served'
      );

      let newSubTotal = validOrders.reduce(
        (result, item) => (result += item.price),
        0
      );

      newSubTotal = Math.round((newSubTotal + Number.EPSILON) * 100) / 100;
      let newTotal = newSubTotal;

      // account for discount code
      const foundDiscount = availableDiscounts.find(
        discount => discount._id === discountCode
      );

      let newDiscountCodeValue = 0;
      let newDiscountCodeError = '';

      if (foundDiscount) {
        // validate if discount code can be used
        const {
          minSpending: discountCodeMinSpending,
          type: discountCodeType,
          value: discountCodeValue,
          cap: discountCodeCap,
        } = foundDiscount;

        if (newTotal < discountCodeMinSpending) {
          newDiscountCodeError = `Bill does not fulfil minimum spending of $${discountCodeMinSpending}`;
        } else {
          // valid discount code
          if (discountCodeType === 'cash') {
            if (discountCodeValue < newTotal) {
              newDiscountCodeValue = discountCodeValue;
            } else {
              newDiscountCodeValue = newTotal;
            }
          } else if (discountCodeType === 'percentage') {
            newDiscountCodeValue = parseFloat(
              newTotal * (discountCodeValue / 100)
            );

            if (newDiscountCodeValue > discountCodeCap) {
              newDiscountCodeValue = discountCodeCap;
            }
          }
        }
      }

      setDiscountCodeError(newDiscountCodeError);
      newDiscountCodeValue =
        Math.round((newDiscountCodeValue + Number.EPSILON) * 100) / 100;
      newTotal = parseFloat(newTotal - newDiscountCodeValue);
      newTotal = Math.round((newTotal + Number.EPSILON) * 100) / 100;

      // account for discount
      let newDiscount = parseFloat(discount ? discount : 0);
      newDiscount = Math.round((newDiscount + Number.EPSILON) * 100) / 100;
      newTotal = parseFloat(newTotal - newDiscount);
      newTotal = Math.round((newTotal + Number.EPSILON) * 100) / 100;

      // account for service charge since service charge is also gst chargeable
      let newServiceCharge = 0;
      if (hasServiceCharge) {
        if (pricesIncludesServiceCharge) {
          newServiceCharge = newTotal * (10 / 110);
        } else {
          newServiceCharge = newTotal * 0.1;

          newServiceCharge =
            Math.round((newServiceCharge + Number.EPSILON) * 100) / 100;
          newTotal = parseFloat(newTotal + newServiceCharge);
          newTotal = Math.round((newTotal + Number.EPSILON) * 100) / 100;
        }
      }

      // account for gst
      let newGst = 0;

      if (gstRegistered) {
        if (pricesIncludesGst) {
          newGst = newTotal * (7 / 107);
        } else {
          newGst = newTotal * 0.07;

          newGst = Math.round((newGst + Number.EPSILON) * 100) / 100;
          newTotal = parseFloat(newTotal + newGst);
          newTotal = Math.round((newTotal + Number.EPSILON) * 100) / 100;
        }
      }

      // account for rounding amts, round to nearest 0.05 only
      let newRoundingAmt = 0;
      if (roundTotalPrice) {
        if (roundDownTotalPrice) {
          let newRoundedDownTotalPrice = Math.floor(newTotal * 20) / 20;

          newRoundingAmt = parseFloat(newTotal - newRoundedDownTotalPrice);
          newRoundingAmt =
            Math.round((newRoundingAmt + Number.EPSILON) * 100) / 100;
          newTotal = newRoundedDownTotalPrice;
        } else {
          let newRoundedUpTotalPrice = Math.ceil(newTotal * 20) / 20;

          newRoundingAmt = parseFloat(newRoundedUpTotalPrice - newTotal);
          newRoundingAmt =
            Math.round((newRoundingAmt + Number.EPSILON) * 100) / 100;
          newTotal = newRoundedUpTotalPrice;
        }
      }

      setBillPrices({
        ...billPrices,
        subTotal: Math.round((newSubTotal + Number.EPSILON) * 100) / 100,
        discountCodeValue:
          Math.round((newDiscountCodeValue + Number.EPSILON) * 100) / 100,
        total: Math.round((newTotal + Number.EPSILON) * 100) / 100,
        serviceCharge:
          Math.round((newServiceCharge + Number.EPSILON) * 100) / 100,
        gst: Math.round((newGst + Number.EPSILON) * 100) / 100,
        roundingAmt: Math.round((newRoundingAmt + Number.EPSILON) * 100) / 100,
      });
    }

    // eslint-disable-next-line
  }, [bill, orders, discount, availableDiscounts, discountCode]);

  const onSettleBill = async () => {
    // check if any orders are invalid
    if (uncompleteOrders.length > 0) {
      dispatch(
        setSnackbar('Uncomplete orders found, please rectify!', 'error')
      );
    } else if (discountCodeError) {
      dispatch(
        setSnackbar('Discount code is invalid, please rectify!', 'error')
      );
    } else {
      const editBillSucess = await editBill({
        ...billData,
        ...billPrices,
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
          title={
            matchAdmin
              ? companyCode && invoiceNo
                ? `${companyCode}${invoiceNo}`
                : ''
              : table?.name
              ? `Table ${table.name}`
              : ''
          }
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

                {Array.isArray(availableDiscounts) &&
                  availableDiscounts.length > 0 && (
                    <Dropdown
                      label='Discount Code Used'
                      name='discountCode'
                      options={[
                        {
                          key: 'NIL',
                          value: '',
                        },
                        ...availableDiscounts.map(({ _id, code }) => ({
                          key: code,
                          value: _id,
                        })),
                      ]}
                      value={discountCode}
                      onChangeHandler={onChange}
                      error={discountCodeError}
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

                {Array.isArray(availableDiscounts) &&
                  availableDiscounts.length > 0 &&
                  discountCode && (
                    <div className='row'>
                      <p className='col-8 body-1'>
                        {`${
                          availableDiscounts.find(
                            discount => discount._id === discountCode
                          ).code
                        } applied`}
                      </p>
                      <p className='col body-1 text-right'>{`- $${discountCodeValue.toFixed(
                        2
                      )}`}</p>
                    </div>
                  )}

                <div className='row'>
                  <p className='col-8 body-1'>Discount</p>
                  <div className='col'>
                    <TextInput
                      name='discount'
                      type='number'
                      value={discount}
                      onChangeHandler={({ value }) =>
                        setBillPrices({ ...billPrices, discount: value })
                      }
                      error={inputErrors.discount}
                    />
                  </div>
                </div>

                <div className='row'>
                  <p className='col-8 body-1'>
                    Service Charge{' '}
                    <span className='body-2'>{`( 10% ${
                      pricesIncludesServiceCharge ? 'inclusive' : ''
                    })`}</span>
                  </p>
                  <span className='col body-1 text-right'>{`$${serviceCharge.toFixed(
                    2
                  )}`}</span>
                </div>

                <div className='row'>
                  <p className='col-8 body-1'>
                    GST{' '}
                    <span className='body-2'>{`( 7% ${
                      pricesIncludesGst ? 'inclusive' : ''
                    })`}</span>
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

export default BillEdit;
