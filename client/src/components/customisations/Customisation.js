import React, { Fragment } from 'react';
import { useParams, useNavigate } from 'react-router-dom';

// Components
import SideSheet from '../layout/SideSheet';
import Spinner from '../layout/Spinner';
import Options from './options/Options';

// Hooks
import useGetOne from '../../query/hooks/useGetOne';
import useErrors from '../../hooks/useErrors';

const Customisation = () => {
  let { id } = useParams();
  const navigate = useNavigate();

  const { data: customisation, isLoading, error } = useGetOne(
    'customisation',
    id
  );
  useErrors(error);

  const { availability, name, title, optional, min, max, options } = {
    ...customisation,
  };

  return (
    <SideSheet wrapper={false}>
      <SideSheet.Header title={name} closeHandler={() => navigate('../')}>
        {availability === false && (
          <span className='badge badge-error'>Unavailable</span>
        )}
      </SideSheet.Header>
      {isLoading || error ? (
        <Spinner />
      ) : (
        <SideSheet.Content>
          {title && (
            <div className='row'>
              <div className='col'>
                <p className='caption'>Title</p>
                <p className='body-1'>{title}</p>
              </div>
            </div>
          )}

          {typeof optional === 'boolean' && (
            <Fragment>
              <div className='row'>
                <div className='col'>
                  <p className='caption mb-h'>Optional ?</p>
                  <span
                    className={`badge badge-${optional ? 'success' : 'error'}`}
                  >
                    {optional ? 'Yes' : 'No'}
                  </span>
                </div>
              </div>

              <div className='row'>
                {!optional && typeof min === 'number' && (
                  <div className='col'>
                    <p className='caption'>Min selection</p>
                    <p className='body-1'>{min}</p>
                  </div>
                )}
                {typeof max === 'number' && (
                  <div className='col'>
                    <p className='caption'>Max selection</p>
                    <p className='body-1'>{max}</p>
                  </div>
                )}
              </div>
            </Fragment>
          )}

          {Array.isArray(options) && (
            <div className='row'>
              <div className='col'>
                <Options options={options} editable={false} />
              </div>
            </div>
          )}
        </SideSheet.Content>
      )}
    </SideSheet>
  );
};

export default Customisation;
