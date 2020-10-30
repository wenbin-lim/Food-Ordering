import React, { useEffect, Fragment } from 'react';
import PropTypes from 'prop-types';
import { connect } from 'react-redux';
import { useParams, useNavigate } from 'react-router-dom';

// Actions
import { getCompany } from '../../../actions/companies';

// Components
import SideSheet from '../../../components/layout/SideSheet';
import Spinner from '../../../components/layout/Spinner';
import SocialMediaButtons from '../../../components/layout/SocialMediaButtons';

const CompanyInfo = ({ getCompany, companies: { requesting, company } }) => {
  let { id } = useParams();
  const navigate = useNavigate();

  useEffect(() => {
    getCompany(id);

    // eslint-disable-next-line
  }, [id]);

  const {
    _id: companyId,
    name,
    displayedName,
    logo: { small: logoSmall, large: logoLarge } = {},
    socialMediaLinks,
  } = { ...company };

  const closeSideSheet = () => navigate('../');

  const sideSheetContent =
    requesting || companyId !== id ? (
      <Spinner />
    ) : (
      <Fragment>
        {name && (
          <div className='row'>
            <div className='col'>
              <p className='caption'>Route name</p>
              <p className='body-1'>{name}</p>
            </div>
          </div>
        )}

        {displayedName && (
          <div className='row'>
            <div className='col'>
              <p className='caption'>Company name</p>
              <p className='body-1'>{displayedName}</p>
            </div>
          </div>
        )}

        {logoSmall && (
          <div className='row'>
            <div className='col'>
              <p className='caption'>Logo (small)</p>
              <img src={logoSmall} alt='company_logo_small' />
            </div>
          </div>
        )}

        {logoLarge && (
          <div className='row'>
            <div className='col'>
              <p className='caption'>Logo (large)</p>
              <img src={logoLarge} alt='company_logo_large' />
            </div>
          </div>
        )}
      </Fragment>
    );

  return (
    <SideSheet
      wrapper={false}
      headerTitle={!requesting || companyId === id ? displayedName : null}
      headerContent={
        (!requesting || companyId === id) && socialMediaLinks ? (
          <SocialMediaButtons socialMediaLinks={socialMediaLinks} />
        ) : null
      }
      closeSideSheetHandler={closeSideSheet}
      content={sideSheetContent}
    />
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
