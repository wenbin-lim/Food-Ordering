/* eslint-disable */
import React, { useState, useEffect, useRef, Fragment } from 'react';
import PropTypes from 'prop-types';

import { connect } from 'react-redux';

// Components
import Dialog from '../../components/layout/Dialog';
import Flippable from '../../components/layout/Flippable';
import SideSheet from '../../components/layout/SideSheet';
import Button from '../../components/layout/Button';
import OrderItem from '../../components/orders/OrderItem';
import FoodDialog from '../../components/foods/FoodDialog';

// Icons
import ArrowIcon from '../../components/icons/ArrowIcon';

// Actions
import { confirmOrders } from '../../actions/customer';

const CartDialog = ({
  bill,
  table,
  screenOrientation,
  unmountCartDialog,
  confirmOrders,
}) => {
  const dialogRef = useRef(null);
  const closeDialog = () =>
    dialogRef.current && dialogRef.current.closeDialog();

  const flippableRef = useRef(null);
  const flipCard = () => flippableRef.current && flippableRef.current.flip();

  const { _id: billId, orders } = bill;

  const [currentOrders, setCurrentOrders] = useState([]);

  useEffect(() => {
    if (Array.isArray(bill?.orders)) {
      setCurrentOrders(bill.orders.filter(order => order.status === 'added'));
    }
  }, [bill]);

  const allOrders = Array.isArray(orders)
    ? orders.filter(order => order.status !== 'added')
    : [];

  const currentCartTotalPrice =
    currentOrders.length > 0
      ? currentOrders
          .map(order => order.price)
          .reduce((acc, curr) => acc + curr)
      : 0;

  const allOrdersTotalPrice =
    allOrders.length > 0
      ? allOrders.map(order => order.price).reduce((acc, curr) => acc + curr)
      : 0;

  const [showFoodDialog, setShowFoodDialog] = useState(false);
  const [foodDialogFood, setFoodDialogFood] = useState();
  const [foodDialogFoodEdit, setFoodDialogFoodEdit] = useState();
  const editOrder = id => {
    const foundOrder = currentOrders.find(order => order._id === id);
    const {
      _id: orderId,
      food,
      quantity,
      customisations,
      additionalInstruction,
    } = foundOrder;
    setFoodDialogFood(food);
    setShowFoodDialog(true);
    setFoodDialogFoodEdit({
      orderId,
      quantity,
      customisations,
      additionalInstruction,
    });
  };

  const deleteOrder = id =>
    setCurrentOrders(currentOrders.filter(order => order._id !== id));

  const currentOrdersContent = (
    <article className='list cart-list'>
      {currentOrders.length > 0 ? (
        currentOrders.map(order => (
          <OrderItem
            key={order._id}
            order={order}
            actions={[
              {
                name: 'Edit',
                callback: () => editOrder(order._id),
              },
              {
                name: 'Delete',
                callback: () => deleteOrder(order._id),
              },
            ]}
          />
        ))
      ) : (
        <p className='caption text-center'>Current cart is empty</p>
      )}
    </article>
  );

  const allOrdersContent = (
    <article className='list cart-list'>
      {allOrders.length > 0 ? (
        allOrders.map(order => (
          <OrderItem key={order._id} order={order} showStatus={true} />
        ))
      ) : (
        <p className='caption text-center'>No items ordered</p>
      )}
    </article>
  );

  const frontFaceTabs = (
    <div className='cart-tabs'>
      <div className='cart-tab active'>Current</div>
      <div className='cart-tab' onClick={flipCard}>
        All Orders
      </div>
    </div>
  );

  const backFaceTabs = (
    <div className='cart-tabs'>
      <div className='cart-tab' onClick={flipCard}>
        Current
      </div>
      <div className='cart-tab active'>All Orders</div>
    </div>
  );

  const onClickOrderBtn = async () => {
    let newCurrentOrders = currentOrders;

    confirmOrders(billId, newCurrentOrders);
    closeDialog();
  };

  const frontFace = (
    <SideSheet
      wrapper={false}
      headerTitle={'Cart'}
      closeSideSheetHandler={closeDialog}
      headerContent={frontFaceTabs}
      contentClass={'list-wrapper'}
      content={currentOrdersContent}
      footerBtn={
        <Button
          classes={'cart-bottom-btn'}
          fill={'contained'}
          type={'primary'}
          block={true}
          blockBtnBottom={true}
          additionalContentClasses={'cart-bottom-btn-price'}
          additionalContent={`$${currentCartTotalPrice.toFixed(2)}`}
          text={'order'}
          icon={<ArrowIcon direction={'right'} />}
          onClick={onClickOrderBtn}
        />
      }
    />
  );

  const backFace = (
    <SideSheet
      wrapper={false}
      headerTitle={'Cart'}
      closeSideSheetHandler={closeDialog}
      headerContent={backFaceTabs}
      contentClass={'list-wrapper'}
      content={allOrdersContent}
      footerBtn={
        <Button
          classes={'cart-bottom-btn'}
          fill={'contained'}
          type={'primary'}
          block={true}
          blockBtnBottom={true}
          additionalContentClasses={'cart-bottom-btn-price'}
          additionalContent={`$${allOrdersTotalPrice.toFixed(2)}`}
          text={'bill'}
          icon={<ArrowIcon direction={'right'} />}
        />
      }
    />
  );

  return (
    <Fragment>
      <Dialog
        ref={dialogRef}
        classes={'flippable-wrapper cart'}
        content={
          <Flippable
            ref={flippableRef}
            wrapper={false}
            frontClass={'cart-front sidesheet'}
            frontContent={frontFace}
            backClass={'cart-back sidesheet'}
            backContent={backFace}
          />
        }
        fullscreen={screenOrientation}
        unmountDialogHandler={unmountCartDialog}
      />
      {showFoodDialog && (
        <FoodDialog
          food={foodDialogFood}
          edit={foodDialogFoodEdit}
          fullscreen={screenOrientation}
          unmountHandler={() => setShowFoodDialog(false)}
        />
      )}
    </Fragment>
  );
};

CartDialog.propTypes = {};

const mapStateToProps = state => ({
  table: state.customer.table,
  bill: state.customer.bill,
  screenOrientation: state.app.screenOrientation,
});

const mapDispatchToProps = {
  confirmOrders,
};

export default connect(mapStateToProps, mapDispatchToProps)(CartDialog);
