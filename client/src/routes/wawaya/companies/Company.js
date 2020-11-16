import React from 'react';
import { useParams, useNavigate } from 'react-router-dom';

// Components
import SideSheet from '../../../components/layout/SideSheet';
import Spinner from '../../../components/layout/Spinner';
import SocialMediaButtons from '../../../components/layout/SocialMediaButtons';

// Hooks
import useGetOne from '../../../query/hooks/useGetOne';
import useErrors from '../../../hooks/useErrors';

const Company = () => {
  let { id } = useParams();
  const navigate = useNavigate();
  const { data: company, isLoading, error } = useGetOne('company', id);
  useErrors(error);

  const {
    name,
    displayedName,
    logo: { small: logoSmall, large: logoLarge } = {},
    socialMediaLinks,
  } = { ...company };

  return (
    <SideSheet wrapper={false}>
      <SideSheet.Header
        title={displayedName}
        closeHandler={() => navigate('../')}
      >
        {socialMediaLinks && (
          <SocialMediaButtons socialMediaLinks={socialMediaLinks} />
        )}
      </SideSheet.Header>
      {isLoading || error ? (
        <Spinner />
      ) : (
        <SideSheet.Content>
          {name && (
            <div className='row'>
              <div className='col'>
                <p className='caption'>Route name</p>
                <p className='body-1'>{name}</p>
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
        </SideSheet.Content>
      )}
    </SideSheet>
  );
};

export default Company;
