import React from 'react';
import { useParams, useNavigate } from 'react-router-dom';

import Moment from 'react-moment';

// Components
import SideSheet from '../layout/SideSheet';
import Spinner from '../layout/Spinner';

// Hooks
import useGetOne from '../../query/hooks/useGetOne';
import useErrors from '../../hooks/useErrors';

const DiscountInfo = () => {
  let { id } = useParams();
  const navigate = useNavigate();
  const { data: discount, isLoading, error } = useGetOne('discount', id, {
    route: `/api/discounts/${id}`,
  });
  useErrors(error);

  const { code, expiry, minSpending, type, value, cap, createdBy } = {
    ...discount,
  };

  return (
    <SideSheet wrapper={false}>
      <SideSheet.Header title={code} closeHandler={() => navigate('../')} />
      {isLoading || error ? (
        <Spinner />
      ) : (
        <SideSheet.Content>
          {expiry && (
            <div className='row'>
              <div className='col'>
                <p className='caption'>Expiry Date</p>
                <p className='body-1'>
                  <Moment local format='DD-MM-YYYY, HH:mmA'>
                    {expiry}
                  </Moment>
                </p>
              </div>
            </div>
          )}

          {type && (
            <div className='row'>
              <div className='col'>
                <p className='caption'>Discount Type</p>
                <p className='body-1'>{type.toUpperCase()}</p>
              </div>
            </div>
          )}

          {typeof value === 'number' && (
            <div className='row'>
              <div className='col'>
                <p className='caption'>{`Price discount value in ${
                  type === 'cash' ? '($)' : '(%)'
                }`}</p>
                <p className='body-1'>{value.toString()}</p>
              </div>
            </div>
          )}

          {typeof minSpending === 'number' && (
            <div className='row'>
              <div className='col'>
                <p className='caption'>Min. spending for discount</p>
                <p className='body-1'>${minSpending.toString()}</p>
              </div>
            </div>
          )}

          {typeof cap === 'number' && type === 'percentage' && (
            <div className='row'>
              <div className='col'>
                <p className='caption'>Cap for percentage based discount</p>
                <p className='body-1'>${cap.toString()}</p>
              </div>
            </div>
          )}

          {createdBy?.name && (
            <div className='row'>
              <div className='col'>
                <p className='caption'>Created by</p>
                <p className='body-1'>{createdBy.name}</p>
              </div>
            </div>
          )}
        </SideSheet.Content>
      )}
    </SideSheet>
  );
};

export default DiscountInfo;
