import React, { createElement } from 'react';
import PropTypes from 'prop-types';

import sanitizeWhiteSpace from '../../utils/sanitizeWhiteSpace';

// Components
import Button from './Button';
import Spinner from './Spinner';

// Icons
import CloseIcon from '../icons/CloseIcon';
import ArrowIcon from '../icons/ArrowIcon';
import MoreIcon from '../icons/MoreIcon';

const SideSheet = ({ wrapper, className, children, ...rest }) => {
  return wrapper ? (
    <article
      className={sanitizeWhiteSpace(`sidesheet ${className ? className : ''}`)}
      {...rest}
    >
      {children}
    </article>
  ) : children ? (
    children
  ) : null;
};

SideSheet.propTypes = {
  wrapper: PropTypes.bool,
  className: PropTypes.string,
};

const Header = ({
  title,
  closeHandler,
  closeBtnIcon = <CloseIcon />,
  moreBtnActionHandler,
  children,
}) => {
  return (
    <header className='sidesheet-header'>
      {closeHandler && (
        <Button
          className='sidesheet-header-close-btn'
          icon={closeBtnIcon}
          onClick={closeHandler}
        />
      )}
      {title && <h3 className='sidesheet-header-title'>{title}</h3>}
      {moreBtnActionHandler && (
        <Button
          className='sidesheet-header-more-btn'
          icon={<MoreIcon type='horizontal' />}
          onClick={moreBtnActionHandler}
        />
      )}
      {children && (
        <section className='sidesheet-header-content'>{children}</section>
      )}
    </header>
  );
};

Header.propTypes = {
  title: PropTypes.string,
  closeHandler: PropTypes.func,
  closeBtnIcon: PropTypes.element,
  moreBtnActionHandler: PropTypes.func,
};

const Content = ({ elementType = 'article', className, children, ...rest }) => {
  return createElement(
    elementType,
    {
      className: sanitizeWhiteSpace(
        `sidesheet-content ${className ? className : ''}`
      ),
      ...rest,
    },
    children
  );
};

Content.propTypes = {
  elementType: PropTypes.string,
  id: PropTypes.string,
  className: PropTypes.string,
  onSubmit: PropTypes.func,
};

const Footer = ({ className, children, ...rest }) => {
  return (
    <footer
      className={sanitizeWhiteSpace(
        `sidesheet-footer ${className ? className : ''}`
      )}
      {...rest}
    >
      {children}
    </footer>
  );
};

Footer.propTypes = {
  className: PropTypes.string,
};

const FooterButton = ({
  text,
  additionalContentClassName,
  additionalContent,
  requesting,
  form,
  onClick,
}) => {
  return (
    <Button
      className='sidesheet-footer'
      fill='contained'
      type='primary'
      block={true}
      blockBtnBottom={true}
      text={text}
      icon={
        requesting ? (
          <Spinner height='1.5rem' />
        ) : (
          <ArrowIcon direction='right' />
        )
      }
      additionalContentClassName={additionalContentClassName}
      additionalContent={additionalContent}
      disabled={requesting}
      submit={form ? true : false}
      form={form}
      onClick={onClick}
    />
  );
};

FooterButton.propTypes = {
  text: PropTypes.string,
  requesting: PropTypes.bool,
  form: PropTypes.string,
};

SideSheet.Header = Header;
SideSheet.Content = Content;
SideSheet.Footer = Footer;
SideSheet.FooterButton = FooterButton;

export default SideSheet;
