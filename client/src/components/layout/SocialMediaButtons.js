// eslint-disable-next-line
import React, { useState, useEffect, useRef } from 'react';
// eslint-disable-next-line
import PropTypes from 'prop-types';
import { connect } from 'react-redux';

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
  1. Prop Name 
  @type       type
  @desc       description
  @required   true
  @default    none
*/
export const SocialMediaButtons = () => {
  return (
    <div
      style={{
        display: 'flex',
        justifyContent: 'center',
      }}
    >
      <Button icon={<FacebookIcon />} />
      <Button icon={<InstagramIcon />} />
      <Button icon={<TwitterIcon />} />
    </div>
  );
};

// eslint-disable-next-line
SocialMediaButtons.propTypes = {};

const mapStateToProps = state => ({});

// eslint-disable-next-line
const mapDispatchToProps = {};

export default connect(mapStateToProps, mapDispatchToProps)(SocialMediaButtons);
