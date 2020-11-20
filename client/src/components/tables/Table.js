import React from 'react';
import { useParams, useNavigate } from 'react-router-dom';

// Components
import SideSheet from '../layout/SideSheet';
import Spinner from '../layout/Spinner';
import QRCode from 'qrcode.react';

// Hooks
import useGetOne from '../../query/hooks/useGetOne';
import useErrors from '../../hooks/useErrors';

const Table = () => {
  let { id } = useParams();
  const navigate = useNavigate();
  const { data: table, isLoading, error } = useGetOne('table', id, {
    route: `/api/tables/${id}`,
  });
  useErrors(error);

  const {
    _id: tableId,
    name,
    company: { _id: companyId, name: companyName } = {},
  } = {
    ...table,
  };

  const locationOrigin = window.location.origin;

  return (
    <SideSheet wrapper={false}>
      <SideSheet.Header title={name} closeHandler={() => navigate('../')} />
      {isLoading || error ? (
        <Spinner />
      ) : (
        <SideSheet.Content>
          {tableId && companyId && companyName && (
            <div className='row'>
              <div className='col'>
                <p className='caption'>QR Code</p>
                <a
                  className={'mb-h'}
                  href={`${locationOrigin}/dinein?company=${companyId}&table=${tableId}`}
                >
                  Link
                </a>
                <br />
                <QRCode
                  value={`${locationOrigin}/dinein?company=${companyId}&table=${tableId}`}
                  renderAs='svg'
                  bgColor='transparent'
                  fgColor='currentColor'
                />
              </div>
            </div>
          )}
        </SideSheet.Content>
      )}
    </SideSheet>
  );
};

export default Table;
