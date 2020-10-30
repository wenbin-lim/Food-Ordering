import React, { useEffect, Fragment } from 'react';
import PropTypes from 'prop-types';
import { connect } from 'react-redux';
import { useParams, useNavigate } from 'react-router-dom';

// Actions
import { getCustomisation } from '../../actions/customisations';

// Components
import SideSheet from '../layout/SideSheet';
import Spinner from '../layout/Spinner';
import Options from './options/Options';

const CustomisationInfo = ({
  customisations: { requesting, customisation },
  getCustomisation,
}) => {
  let { id } = useParams();
  const navigate = useNavigate();

  useEffect(() => {
    getCustomisation(id);

    // eslint-disable-next-line
  }, [id]);

  const {
    _id: customisationId,
    availability,
    name,
    title,
    selection,
    min,
    max,
    options,
  } = {
    ...customisation,
  };

  const getCustomisationSelectionString = () => {
    switch (selection) {
      case 'nolimit':
        return 'No Limit';
      case 'min':
        return `Minimum selection of ${min}`;
      case 'max':
        return `Maximum selection of ${max}`;
      case 'range':
        return `Selection range of ${min} to ${max}`;
      default:
        return '';
    }
  };

  const closeSideSheet = () => navigate('../');

  const sideSheetContent =
    requesting || customisationId !== id ? (
      <Spinner />
    ) : (
      <Fragment>
        {title && (
          <div className='row'>
            <div className='col'>
              <p className='caption'>Title</p>
              <p className='body-1'>{title}</p>
            </div>
          </div>
        )}

        <div className='row'>
          <div className='col'>
            <p className='caption'>Option selection value</p>
            <p className='body-1'>{getCustomisationSelectionString()}</p>
          </div>
        </div>

        {Array.isArray(options) && (
          <div className='row'>
            <div className='col'>
              <Options options={options} editable={false} />
            </div>
          </div>
        )}
      </Fragment>
    );

  return (
    <SideSheet
      wrapper={false}
      headerTitle={!requesting || customisationId === id ? name : null}
      headerContent={
        (!requesting || customisationId === id) && availability === false ? (
          <span className='badge badge-error'>Unavailable</span>
        ) : null
      }
      closeSideSheetHandler={closeSideSheet}
      content={sideSheetContent}
    />
  );
};

CustomisationInfo.propTypes = {
  customisations: PropTypes.object.isRequired,
  getCustomisation: PropTypes.func.isRequired,
};

const mapStateToProps = state => ({
  customisations: state.customisations,
});

const mapDispatchToProps = { getCustomisation };

export default connect(mapStateToProps, mapDispatchToProps)(CustomisationInfo);
