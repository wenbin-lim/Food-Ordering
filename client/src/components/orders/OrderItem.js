import React, { useState, Fragment } from 'react';
import PropTypes from 'prop-types';
import { connect } from 'react-redux';
import { useDispatch } from 'react-redux';

import Moment from 'react-moment';

// Actions
import { setSnackbar } from '../../actions/app';

// Components
import ListItem, { Action as ListItemAction } from '../layout/ListItem';
import ActionSheet, {
  Action as ActionSheetAction,
} from '../layout/ActionSheet';
import FormDialog from '../layout/FormDialog';
import TextInput from '../layout/TextInput';
import OrderDialog from './OrderDialog';
import OrderActivityDialog from './OrderActivityDialog';
import AddAdditionalItemDialog from './AddAdditionalItemDialog';

// Icons
import InfoIcon from '../icons/InfoIcon';
import EditIcon from '../icons/EditIcon';
import RemoveIcon from '../icons/RemoveIcon';
import DollarIcon from '../icons/DollarIcon';

// Custom Hooks
import useErrors from '../../hooks/useErrors';
import usePut from '../../query/hooks/usePut';
import useDelete from '../../query/hooks/useDelete';

// Misc
import checkIfSameDate from '../../utils/checkIfSameDate';

const OrderItem = ({
  data,
  accessRole = 'customer',
  showStatus = true,
  editable = true,
}) => {
  const dispatch = useDispatch();

  const [showActionSheet, setShowActionSheet] = useState(false);

  const [showOrderActivityDialog, setShowOrderActivityDialog] = useState(false);

  const [showOrderDialog, setShowOrderDialog] = useState(false);
  const [
    showAddAdditionalItemDialog,
    setShowAddAdditionalItemDialog,
  ] = useState(false);

  const [showOnHoldOrderDialog, setShowOnHoldOrderDialog] = useState(false);
  const [onHoldRemarks, setOnHoldRemarks] = useState('');
  const [showCancelOrderDialog, setShowCancelOrderDialog] = useState(false);
  const [cancelRemarks, setCancelRemarks] = useState('');
  const [showRemoveOrderDialog, setShowRemoveOrderDialog] = useState(false);
  const [removeRemarks, setRemoveRemarks] = useState('');
  const [showRejectOrderDialog, setShowRejectOrderDialog] = useState(false);
  const [rejectRemarks, setRejectRemarks] = useState('');

  const {
    _id: orderId,
    food,
    isAdditionalItem,
    additionalItemName,
    quantity,
    price,
    customisationsUsed,
    additionalInstruction,
    currentStatus,
    activities,
    bill,
  } = data;
  const { name: foodName } = { ...food };
  const latestActivity = activities[activities.length - 1];

  const [editOrder, { error: editError }] = usePut('orders', {
    route: `/api/orders/${orderId}`,
  });
  useErrors(editError);

  const [deleteOrder, { error: deleteError }] = useDelete('orders', {
    route: `/api/orders/${orderId}`,
  });
  useErrors(deleteError);

  const getStatusColor = status => {
    switch (status) {
      case 'new':
      case 'preparing':
      case 'updated':
        return 'focus';
      case 'cooking':
        return 'warning';
      case 'ready':
      case 'served':
        return 'success';
      case 'hold':
      case 'cancelled':
      case 'rejected':
      case 'removed':
        return 'error';
      default:
        return 'surface3';
    }
  };

  const getStatusMsg = status => {
    switch (status) {
      case 'new':
        return 'ordered at ';
      case 'preparing':
        return 'sent to kitchen at ';
      case 'cooking':
        return 'start cooking at ';
      case 'hold':
        return 'put on hold at ';
      case 'updated':
        return 'updated at ';
      case 'ready':
        return 'cooked at ';
      case 'served':
        return 'served at ';
      case 'cancelled':
        return 'cancelled at ';
      case 'rejected':
        return 'rejected at ';
      case 'removed':
        return 'removed at ';
      default:
        return '';
    }
  };

  const showEditAndCancelBtn = status =>
    status === 'new' ||
    status === 'preparing' ||
    status === 'cooking' ||
    status === 'hold' ||
    status === 'updated';

  const showBillBtn = status =>
    status === 'new' ||
    status === 'preparing' ||
    status === 'cooking' ||
    status === 'hold' ||
    status === 'updated' ||
    status === 'ready' ||
    status === 'rejected';

  const showRemoveBtn = status =>
    status === 'ready' || status === 'served' || status === 'rejected';

  const showRejectBtn = status => status === 'ready' || status === 'served';

  const onOrderDelete = async () => {
    const deleteOrderSuccess = await deleteOrder();

    if (deleteOrderSuccess) {
      dispatch(setSnackbar('Order deleted!', 'success'));
    }
  };

  const updateOrder = async (newStatus, newRemarks = '') =>
    await editOrder({
      ...data,
      food: food?._id,
      currentStatus: newStatus,
      bill: bill?._id,
      remarks: newRemarks,
    });

  return (
    <Fragment>
      <ListItem>
        <ListItem.Content className='orderitem'>
          {showStatus && (
            <div className='orderitem-statusbar'>
              <div
                className={`orderitem-status-${getStatusColor(currentStatus)}`}
              />
              <span className='orderitem-status-info'>
                {getStatusMsg(currentStatus)}
                <Moment
                  local
                  format={
                    checkIfSameDate(latestActivity.date)
                      ? 'HH:mmA'
                      : 'HH:mmA, DD MMM'
                  }
                >
                  {latestActivity.date}
                </Moment>
              </span>
            </div>
          )}
          <div className='orderitem-info'>
            <p className='orderitem-info-name'>
              {isAdditionalItem ? additionalItemName : foodName}
            </p>
            {customisationsUsed.map(({ optionsSelected }) =>
              optionsSelected.map(({ _id: optionId, name }) => (
                <p key={optionId} className='orderitem-info-customisation'>
                  {name}
                </p>
              ))
            )}
            {additionalInstruction && (
              <span className='orderitem-info-additionalinstruction'>
                {additionalInstruction}
              </span>
            )}
          </div>
          {isAdditionalItem === false && (
            <div className='orderitem-qty'>x {quantity}</div>
          )}
          <div className='orderitem-price'>${price.toFixed(2)}</div>
        </ListItem.Content>

        {editable && accessRole === 'kitchen' && (
          <ListItem.Actions>
            <ListItemAction
              name='Manage'
              onClick={() => setShowActionSheet(true)}
            />
            <ListItemAction
              name='Cook'
              onClick={() => updateOrder('cooking')}
            />
            <ListItemAction name='Serve' onClick={() => updateOrder('ready')} />
          </ListItem.Actions>
        )}

        {editable && accessRole === 'waiter' && (
          <ListItem.Actions>
            <ListItemAction
              name='View'
              onClick={() => setShowOrderActivityDialog(true)}
            />

            {showEditAndCancelBtn(currentStatus) && (
              <ListItemAction
                name='Edit'
                onClick={() =>
                  isAdditionalItem
                    ? setShowAddAdditionalItemDialog(true)
                    : setShowOrderDialog(true)
                }
              />
            )}

            {showEditAndCancelBtn(currentStatus) && (
              <ListItemAction
                name='Cancel'
                onClick={() => setShowCancelOrderDialog(true)}
              />
            )}

            {showRejectBtn(currentStatus) && (
              <ListItemAction
                name='Reject'
                onClick={() => setShowRejectOrderDialog(true)}
              />
            )}

            {currentStatus === 'ready' && (
              <ListItemAction
                name='Serve'
                onClick={() => updateOrder('served')}
              />
            )}
          </ListItem.Actions>
        )}

        {editable && (accessRole === 'cashier' || accessRole === 'admin') && (
          <ListItem.Actions>
            <ListItemAction
              icon={<InfoIcon />}
              onClick={() => setShowOrderActivityDialog(true)}
            />

            {showEditAndCancelBtn(currentStatus) && (
              <ListItemAction
                icon={<EditIcon />}
                onClick={() =>
                  isAdditionalItem
                    ? setShowAddAdditionalItemDialog(true)
                    : setShowOrderDialog(true)
                }
              />
            )}

            {showEditAndCancelBtn(currentStatus) && (
              <ListItemAction
                icon={<RemoveIcon />}
                onClick={() => setShowCancelOrderDialog(true)}
              />
            )}

            {showRemoveBtn(currentStatus) && (
              <ListItemAction
                icon={<RemoveIcon />}
                onClick={() => setShowRemoveOrderDialog(true)}
              />
            )}

            {showBillBtn(currentStatus) && (
              <ListItemAction
                icon={<DollarIcon />}
                onClick={() => updateOrder('served')}
              />
            )}
          </ListItem.Actions>
        )}

        {editable && accessRole === 'customer' && currentStatus === 'new' && (
          <ListItem.Actions>
            <ListItemAction
              name='Edit'
              onClick={() => setShowOrderDialog(true)}
            />
            <ListItemAction name='Delete' onClick={onOrderDelete} />
          </ListItem.Actions>
        )}
      </ListItem>

      {showActionSheet && (
        <ActionSheet onCloseActionSheet={() => setShowActionSheet(false)}>
          <ActionSheetAction
            name="Can't fulfil special instructions"
            onClick={() =>
              updateOrder('hold', "Can't fulfil special instructions")
            }
          />
          <ActionSheetAction
            name='Ingredients out of stock'
            onClick={() => updateOrder('hold', 'Ingredients out of stock')}
          />
          <ActionSheetAction
            name='Others'
            onClick={() => setShowOnHoldOrderDialog(true)}
          />
        </ActionSheet>
      )}

      {showOrderDialog && (
        <OrderDialog
          foodDetails={food}
          order={data}
          onCloseOrderDialog={() => setShowOrderDialog(false)}
        />
      )}

      {showAddAdditionalItemDialog && (
        <AddAdditionalItemDialog
          additionalItem={data}
          onCloseAddAdditionalItemDialog={() =>
            setShowAddAdditionalItemDialog(false)
          }
        />
      )}

      {showOrderActivityDialog && (
        <OrderActivityDialog
          order={data}
          onCloseOrderActivityDialog={() => setShowOrderActivityDialog(false)}
        />
      )}

      {showOnHoldOrderDialog && (
        <FormDialog
          elementType='article'
          title='Remarks'
          onSubmit={() => updateOrder('hold', onHoldRemarks)}
          onCloseFormDialog={() => setShowOnHoldOrderDialog(false)}
        >
          <TextInput
            name='onHoldRemarks'
            type='text'
            value={onHoldRemarks}
            onChangeHandler={({ value }) => setOnHoldRemarks(value)}
          />
        </FormDialog>
      )}

      {showCancelOrderDialog && (
        <FormDialog
          elementType='article'
          title='Cancel Reason'
          onSubmit={() => updateOrder('cancelled', cancelRemarks)}
          onCloseFormDialog={() => setShowCancelOrderDialog(false)}
        >
          <TextInput
            name='cancelRemarks'
            type='text'
            value={cancelRemarks}
            onChangeHandler={({ value }) => setCancelRemarks(value)}
          />
        </FormDialog>
      )}

      {showRemoveOrderDialog && (
        <FormDialog
          elementType='article'
          title='Remove Reason'
          onSubmit={() => updateOrder('removed', removeRemarks)}
          onCloseFormDialog={() => setShowRemoveOrderDialog(false)}
        >
          <TextInput
            name='removeRemarks'
            type='text'
            value={removeRemarks}
            onChangeHandler={({ value }) => setRemoveRemarks(value)}
          />
        </FormDialog>
      )}

      {showRejectOrderDialog && (
        <FormDialog
          elementType='article'
          title='Reject Reason'
          onSubmit={() => updateOrder('rejected', rejectRemarks)}
          onCloseFormDialog={() => setShowRejectOrderDialog(false)}
        >
          <TextInput
            name='rejectRemarks'
            type='text'
            value={rejectRemarks}
            onChangeHandler={({ value }) => setRejectRemarks(value)}
          />
        </FormDialog>
      )}
    </Fragment>
  );
};

OrderItem.propTypes = {
  data: PropTypes.object,
  accessRole: PropTypes.oneOf([
    'customer',
    'kitchen',
    'waiter',
    'cashier',
    'admin',
  ]),
  showStatus: PropTypes.bool,
  editable: PropTypes.bool,
};
const mapStateToProps = state => ({
  auth: state.auth,
});

const mapDispatchToProps = {};

export default connect(mapStateToProps, mapDispatchToProps)(OrderItem);
