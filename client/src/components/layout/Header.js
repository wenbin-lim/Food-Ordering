import React from 'react';
import PropTypes from 'prop-types';
import { connect } from 'react-redux';
import { useNavigate } from 'react-router-dom';

// Components
import Button from './Button';

// Icons
import ArrowIcon from '../icons/ArrowIcon';
import CloseIcon from '../icons/CloseIcon';
import MoreIcon from '../icons/MoreIcon';

/* 
  =====
  Props
  =====
  @name       headerClass 
  @type       string
  @desc       additional classes for header component
  @required   false

  @name       title 
  @type       string
  @desc       title of the header
  @required   false
  
  @name       content 
  @type       jsx or string
  @desc       content that lies below the title 
  @required   false

  @name       closeActionCallback 
  @type       string or function
  @desc       if string, navigate to the string path
  @desc       if function, does the callback function
  @required   false

  @name       moreActionCallback 
  @type       function
  @desc       does the callback function when clicked on the more-action-btn
  @required   false

  @name       screenOrientation 
  @type       type
  @desc       description
  @required   true
*/
const Header = ({
  headerClass,
  title,
  content,
  closeActionCallback,
  moreActionCallback,
  screenOrientation,
}) => {
  let navigate = useNavigate();

  const close = () => {
    if (
      typeof closeActionCallback === 'string' ||
      typeof closeActionCallback === 'number'
    ) {
      navigate(closeActionCallback);
    } else if (typeof closeActionCallback === 'function') {
      closeActionCallback();
    }
  };

  return (
    <header className={`header ${headerClass ? headerClass : ''}`.trim()}>
      {closeActionCallback && (
        <Button
          icon={screenOrientation ? <ArrowIcon /> : <CloseIcon />}
          onClick={close}
          additionalClasses={'header-close-btn'}
        />
      )}
      {title && <h2 className='header-title'>{title}</h2>}
      {moreActionCallback && (
        <Button
          icon={
            screenOrientation ? <MoreIcon /> : <MoreIcon type='horizontal' />
          }
          onClick={close}
          additionalClasses={'header-more-action-btn'}
        />
      )}

      {content && <div className='header-content'>{content}</div>}
    </header>
  );
};

Header.propTypes = {
  headerClass: PropTypes.string,
  title: PropTypes.string,
  content: PropTypes.oneOfType([PropTypes.element, PropTypes.string]),
  closeActionCallback: PropTypes.oneOfType([
    PropTypes.string,
    PropTypes.number,
    PropTypes.func,
  ]),
  moreActionCallback: PropTypes.func,
  screenOrientation: PropTypes.bool,
};

const mapStateToProps = state => ({
  screenOrientation: state.app.screenOrientation,
});

const mapDispatchToProps = {};

export default connect(mapStateToProps, mapDispatchToProps)(Header);
