import React, { useState, useEffect, Fragment } from 'react';
import PropTypes from 'prop-types';

// Components
import Spinner from '../../components/layout/Spinner';

// Hooks
import useGetOne from '../../query/hooks/useGetOne';
import useErrors from '../../hooks/useErrors';

const Receipt = ({ billId }) => {
  const { data: bill, isLoading: billLoading, error } = useGetOne(
    'bill',
    billId,
    {
      route: `/api/bills/${billId}`,
      enabled: billId,
    }
  );
  useErrors(error);

  const {
    data: orders,
    isLoading: ordersLoading,
    error: ordersErrors,
  } = useGetOne('orders', billId, {
    route: '/api/orders',
    params: { type: 'cashier', bill: billId },
  });
  useErrors(ordersErrors);

  const {
    company,
    table,
    user,
    invoiceNo,
    subTotal,
    discount,
    discountCode,
    discountCodeValue,
    total,
    gst,
    serviceCharge,
    roundingAmt,
    endTime,
    paymentMethod,
  } = { ...bill };

  const {
    displayedName,
    companyCode,
    address,
    contact,
    gstRegNo,
    roundDownTotalPrice,
  } = {
    ...company,
  };
  const { name: tableName } = { ...table };
  const { name: staffName } = { ...user };

  const [validOrders, setValidOrders] = useState([]);

  useEffect(() => {
    if (Array.isArray(orders)) {
      let newValidOrders = orders.filter(
        ({ currentStatus }) => currentStatus === 'served'
      );

      // consolidate similar orders
      // find unique orders
      let uniqueOrders = newValidOrders.map(order => {
        let name = '';
        if (order.isAdditionalItem) {
          name = order.additionalItemName;
        } else {
          name = order.food?.name;
        }

        let customisations = '';
        if (order.customisationsUsed.length > 0) {
          let options = [];
          order.customisationsUsed.forEach(({ optionsSelected }) => {
            optionsSelected.forEach(option => {
              options.push(option.name);
            });
          });
          options = options.join(',');
          customisations = options;
        }

        return {
          name,
          customisations,
          price: order.price,
        };
      });

      uniqueOrders = uniqueOrders.filter(
        (v, i, a) =>
          a.findIndex(t => JSON.stringify(t) === JSON.stringify(v)) === i
      );

      // map through unique orders
      let conslidatedOrders = [];

      uniqueOrders.forEach(uniqueOrder => {
        const { name, customisations, price } = uniqueOrder;

        let conslidatedOrder = newValidOrders
          .filter(({ food, isAdditionalItem, additionalItemName }) =>
            isAdditionalItem ? additionalItemName === name : food.name === name
          )
          .filter(({ customisationsUsed }) => {
            let options = [];
            customisationsUsed.forEach(({ optionsSelected }) => {
              optionsSelected.forEach(option => {
                options.push(option.name);
              });
            });
            options = options.join(',');

            if (options === customisations) {
              return true;
            } else {
              return false;
            }
          })
          .filter(order => order.price === price);

        if (conslidatedOrder.length > 1) {
          conslidatedOrders.push({
            ...conslidatedOrder[0],
            quantity: conslidatedOrder.length,
            price: conslidatedOrder[0].price * conslidatedOrder.length,
          });
        } else {
          conslidatedOrders.push(conslidatedOrder[0]);
        }
      });

      setValidOrders(conslidatedOrders);
    }

    // eslint-disable-next-line
  }, [orders]);

  return (
    <article className='receipt'>
      {billLoading || ordersLoading ? (
        <Spinner />
      ) : (
        <Fragment>
          <section className='receipt-companyinfo'>
            <h1 className='receipt-companyname'>{displayedName}</h1>
            <p className='receipt-companyaddress'>{address}</p>
            <p className='receipt-companycontact'>{contact}</p>
            {gstRegNo && (
              <p className='receipt-gstregnumber'>GST No. {gstRegNo}</p>
            )}
          </section>

          <hr />

          <section className='receipt-billinfo'>
            <h2 className='heading-2 text-center'>Receipt</h2>

            <div className='receipt-billinfo-row'>
              <p className='receipt-billinfo-row-key'>Invoice No</p>
              <p className='receipt-billinfo-row-value'>{`${companyCode}${invoiceNo}`}</p>
            </div>

            <div className='receipt-billinfo-row'>
              <p className='receipt-billinfo-row-key'>Table</p>
              <p className='receipt-billinfo-row-value'>{tableName}</p>
            </div>

            <div className='receipt-billinfo-row'>
              <p className='receipt-billinfo-row-key'>Time</p>
              <p className='receipt-billinfo-row-value'>{endTime}</p>
            </div>

            <div className='receipt-billinfo-row'>
              <p className='receipt-billinfo-row-key'>Staff</p>
              <p className='receipt-billinfo-row-value'>{staffName}</p>
            </div>
          </section>

          <hr />

          <section className='receipt-orderinfo'>
            {validOrders.map(order => (
              <div key={order._id} className='receipt-orderitem'>
                <p className='receipt-orderitem-qty'>{order.quantity}</p>
                <div className='receipt-orderitem-details'>
                  <p className='receipt-orderitem-name'>
                    {order.isAdditionalItem
                      ? order.additionalItemName
                      : order.food?.name}
                  </p>
                  {Array.isArray(order.customisationsUsed) &&
                    order.customisationsUsed.map(({ optionsSelected }) =>
                      optionsSelected.map(({ _id: optionId, name }) => (
                        <p
                          key={optionId}
                          className='receipt-orderitem-customisation'
                        >
                          {name}
                        </p>
                      ))
                    )}
                </div>
                <p className='receipt-orderitem-price'>
                  ${order.price.toFixed(2)}
                </p>
              </div>
            ))}
          </section>

          <hr />

          <section className='receipt-priceinfo'>
            <div className='receipt-priceinfo-row'>
              <p className='receipt-priceinfo-row-key'>Sub-Total</p>
              <p className='receipt-priceinfo-row-value'>
                ${typeof subTotal === 'number' ? subTotal.toFixed(2) : '0.00'}
              </p>
            </div>

            {Array.isArray(discountCode) && discountCode.length > 0 && (
              <div className='receipt-priceinfo-row'>
                <p className='receipt-priceinfo-row-key'>{`${discountCode[0].code} applied`}</p>
                <p className='receipt-priceinfo-row-value'>
                  - $
                  {typeof discountCodeValue === 'number'
                    ? discountCodeValue.toFixed(2)
                    : '0.00'}
                </p>
              </div>
            )}

            <div className='receipt-priceinfo-row'>
              <p className='receipt-priceinfo-row-key'>Discount</p>
              <p className='receipt-priceinfo-row-value'>
                ${typeof discount === 'number' ? discount.toFixed(2) : '0.00'}
              </p>
            </div>

            <div className='receipt-priceinfo-row'>
              <p className='receipt-priceinfo-row-key'>Service Charge</p>
              <p className='receipt-priceinfo-row-value'>
                $
                {typeof serviceCharge === 'number'
                  ? serviceCharge.toFixed(2)
                  : '0.00'}
              </p>
            </div>

            <div className='receipt-priceinfo-row'>
              <p className='receipt-priceinfo-row-key'>GST 7%</p>
              <p className='receipt-priceinfo-row-value'>
                ${typeof gst === 'number' ? gst.toFixed(2) : '0.00'}
              </p>
            </div>

            <div className='receipt-priceinfo-row mb-h'>
              <p className='receipt-priceinfo-row-key'>Rounding</p>
              <p className='receipt-priceinfo-row-value'>
                {`${roundDownTotalPrice ? '-' : '+'} $${
                  typeof roundingAmt === 'number'
                    ? roundingAmt.toFixed(2)
                    : '0.00'
                }`}
              </p>
            </div>

            <hr />
            <div className='receipt-priceinfo-row receipt-totalprice'>
              <p className='receipt-priceinfo-row-key'>Total</p>
              <p className='receipt-priceinfo-row-value'>
                ${typeof total === 'number' ? total.toFixed(2) : '0.00'}
              </p>
            </div>

            <hr />

            <div className='receipt-priceinfo-row mt-h'>
              <p className='receipt-priceinfo-row-key'>Payment Method</p>
              <p className='receipt-priceinfo-row-value'>
                {paymentMethod ? paymentMethod.toUpperCase() : ''}
              </p>
            </div>
          </section>
        </Fragment>
      )}
    </article>
  );
};

Receipt.propTypes = {
  billId: PropTypes.string,
};

export default Receipt;
