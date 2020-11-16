/* eslint-disable */
import React, { useState, useEffect, useRef, Fragment } from 'react';
import PropTypes from 'prop-types';
import { useDispatch } from 'react-redux';

import { connect } from 'react-redux';

// Actions
import { setSnackbar } from '../../actions/app';

// Components
import Container from '../../components/layout/Container';
import Tabs, { Tab } from '../../components/layout/Tabs';
import List from '../../components/layout/List';
import Dialog from '../../components/layout/Dialog';
import Flippable from '../../components/layout/Flippable';
import SideSheet from '../../components/layout/SideSheet';
import Button from '../../components/layout/Button';
import OrderItem from '../../components/orders/OrderItem';

// Icons
import ArrowIcon from '../../components/icons/ArrowIcon';

// Hooks
import useGetAll from '../../query/hooks/useGetAll';
import useEditMany from '../../query/hooks/useEditMany';
import useErrors from '../../hooks/useErrors';

const Cart = ({ user }) => {
  const dispatch = useDispatch();

  const { bill } = user;
  const [activeTab, setActiveTab] = useState(0);
  const onClickTab = tabIndex => setActiveTab(tabIndex);

  const [cartPrice, setCartPrice] = useState(0);
  const [addedOrders, setAddedOrders] = useState([]);
  const [confirmedOrders, setConfirmedOrders] = useState([]);

  const {
    data: orders,
    isLoading: ordersLoading,
    error: ordersError,
  } = useGetAll('orders', { bill: bill._id }, bill._id);
  useErrors(ordersError);

  const [
    checkoutOrders,
    { isLoading: checkoutRequesting, error: checkoutErrors },
  ] = useEditMany('orders');

  useEffect(() => {
    if (orders) {
      if (activeTab === 0) {
        const newAddedOrders = orders.filter(
          ({ status }) => status === 'added'
        );

        setAddedOrders(newAddedOrders);

        let newCurrentCartPrice = newAddedOrders.reduce(
          (result, item) => (result += item.price),
          0
        );

        setCartPrice(newCurrentCartPrice);
      } else if (activeTab === 1) {
        const newConfirmedOrders = orders.filter(
          ({ status }) => status !== 'added'
        );

        setConfirmedOrders(newConfirmedOrders);

        let newAllOrdersPrice = newConfirmedOrders.reduce(
          (result, item) => (result += item.price),
          0
        );

        setCartPrice(newAllOrdersPrice);
      }
    }

    // eslint-disable-next-line
  }, [activeTab, ordersLoading, orders]);

  const onClickFooterBtn = async () => {
    if (activeTab === 0) {
      const checkoutOrdersSuccess = await checkoutOrders({
        editType: 'confirmingOrders',
        orders: addedOrders,
      });

      if (checkoutOrdersSuccess) {
        dispatch(setSnackbar(checkoutOrdersSuccess, 'success'));
      }
      console.log(checkoutOrdersSuccess);
    } else if (activeTab === 1) {
    }
  };

  return (
    <Container className='cart'>
      <Tabs className='cart-tabs' onClickTab={onClickTab}>
        <Tab name='Current Cart' />
        <Tab name='All Orders' />
      </Tabs>

      {activeTab === 0 && (
        <List
          wrapper={true}
          className='cart-list'
          loading={ordersLoading}
          listArr={addedOrders}
          listItem={<OrderItem editable={true} />}
          enableSearch={false}
        />
      )}

      {activeTab === 1 && (
        <List
          wrapper={true}
          className='cart-list'
          loading={ordersLoading}
          listArr={confirmedOrders}
          listItem={<OrderItem showStatus={true} />}
          enableSearch={false}
        />
      )}

      <footer className='cart-footer'>
        <h2 className='cart-price'>${cartPrice.toFixed(2)}</h2>
        <Button
          className='cart-footer-btn'
          text={activeTab === 0 ? 'Checkout' : 'Bill'}
          icon={<ArrowIcon direction='right' />}
          ripple={false}
          onClick={onClickFooterBtn}
        />
      </footer>
    </Container>
  );
};

Cart.propTypes = {
  user: PropTypes.object,
};

const mapStateToProps = state => ({
  // table: state.customer.table,
  // bill: state.customer.bill,
  // screenOrientation: state.app.screenOrientation,
});

const mapDispatchToProps = {
  // confirmOrders,
};

export default connect(mapStateToProps, mapDispatchToProps)(Cart);
