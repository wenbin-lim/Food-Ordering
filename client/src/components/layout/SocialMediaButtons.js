import React from 'react';
import PropTypes from 'prop-types';

// Components
import Button from './Button';

// Icons
import TwitterIcon from '../icons/TwitterIcon';
import FacebookIcon from '../icons/FacebookIcon';
import InstagramIcon from '../icons/InstagramIcon';

/* 
  =====
  Props
  =====
  @name       socialMediaLinks
  @type       object of {facebook, twitter, instagram: url string}
  @desc       facebook twitter instagram redirect links
  @required   false
*/
export const SocialMediaButtons = ({ socialMediaLinks }) => {
  return socialMediaLinks ? (
    <div
      style={{
        display: 'flex',
        justifyContent: 'center',
      }}
    >
      {socialMediaLinks.facebook && (
        <Button
          icon={<FacebookIcon />}
          onClick={() => window.open(socialMediaLinks.facebook)}
        />
      )}
      {socialMediaLinks.instagram && (
        <Button
          icon={<InstagramIcon />}
          onClick={() => window.open(socialMediaLinks.instagram)}
        />
      )}
      {socialMediaLinks.twitter && (
        <Button
          icon={<TwitterIcon />}
          onClick={() => window.open(socialMediaLinks.twitter)}
        />
      )}
    </div>
  ) : null;
};

SocialMediaButtons.propTypes = {
  socialMediaLinks: PropTypes.shape({
    facebook: PropTypes.string,
    twitter: PropTypes.string,
    instagram: PropTypes.string,
  }),
};

export default SocialMediaButtons;
