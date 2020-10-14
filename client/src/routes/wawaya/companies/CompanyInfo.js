import React, { useEffect, Fragment } from 'react';
import PropTypes from 'prop-types';
import { connect } from 'react-redux';
import { useParams } from 'react-router-dom';

import Moment from 'react-moment';

// Actions
import { getCompany } from '../../../actions/companies';

// Components
import Header from '../../../components/layout/Header';
import Spinner from '../../../components/layout/Spinner';

/* 
  =====
  Props
  =====
  @name       getCompany 
  @type       function
  @desc       redux action to retrieve company info from redux state
  @required   true

  @name       companies 
  @type       object
  @desc       app level companies state
  @required   true
*/

const CompanyInfo = ({ getCompany, companies: { company } }) => {
  let { id } = useParams();

  useEffect(() => {
    getCompany(id);
  }, [id]);

  return (
    <div
      style={{
        height: '100%',
        display: 'grid',
        gridTemplateRows: 'auto 1fr auto',
      }}
    >
      <Header title={'Company Info'} closeActionCallback={'../'} />

      <div
        style={{
          userSelect: 'auto',
        }}
      >
        {company && (
          <div style={{ padding: '1rem' }}>
            {company.name && (
              <Fragment>
                <p className='caption'>Name</p>
                <p className='body-1' style={{ marginBottom: '1rem' }}>
                  {company.name}
                </p>
              </Fragment>
            )}

            {company.displayedName && (
              <Fragment>
                <p className='caption'>Displayed Name</p>
                <p className='body-1' style={{ marginBottom: '1rem' }}>
                  {company.displayedName}
                </p>
              </Fragment>
            )}

            {company.creationDate && (
              <Fragment>
                <p className='caption'>Created at</p>
                <p className='body-1' style={{ marginBottom: '1rem' }}>
                  <Moment format='DD-MM-YYYY'>{company.creationDate}</Moment>
                </p>
              </Fragment>
            )}

            {company.logo && (
              <Fragment>
                <p className='caption' style={{ marginBottom: '0.5rem' }}>
                  Logos
                </p>
                <div
                  style={{
                    marginBottom: '1rem',
                    display: 'grid',
                    gridTemplateColumns: '1fr 1fr',
                    placeItems: 'center',
                  }}
                >
                  {company.logo.large && (
                    <img
                      src={company.logo.large}
                      alt='large_logo'
                      style={{
                        maxWidth: '100%',
                        maxHeight: '100px',
                      }}
                    />
                  )}
                  {company.logo.small && (
                    <img
                      src={company.logo.small}
                      alt='small_logo'
                      style={{
                        maxWidth: '100%',
                        maxHeight: '100px',
                      }}
                    />
                  )}
                </div>

                {company.socialMediaLinks && (
                  <Fragment>
                    <p className='caption'>Social Media Links</p>
                    {company.socialMediaLinks.facebook && (
                      <p className='body-2' style={{ marginBottom: '0.5rem' }}>
                        {company.socialMediaLinks.facebook}
                      </p>
                    )}
                    {company.socialMediaLinks.instagram && (
                      <p className='body-2' style={{ marginBottom: '0.5rem' }}>
                        {company.socialMediaLinks.instagram}
                      </p>
                    )}
                    {company.socialMediaLinks.twitter && (
                      <p className='body-2' style={{ marginBottom: '0.5rem' }}>
                        {company.socialMediaLinks.twitter}
                      </p>
                    )}
                  </Fragment>
                )}
              </Fragment>
            )}
          </div>
        )}
      </div>
    </div>
  );
};

CompanyInfo.propTypes = {
  getCompany: PropTypes.func.isRequired,
  companies: PropTypes.object.isRequired,
};

const mapStateToProps = state => ({
  companies: state.companies,
});

const mapDispatchToProps = { getCompany };

export default connect(mapStateToProps, mapDispatchToProps)(CompanyInfo);
