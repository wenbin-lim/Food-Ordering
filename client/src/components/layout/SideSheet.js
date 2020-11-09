import React, { createElement } from 'react';
import PropTypes from 'prop-types';

import sanitizeWhiteSpace from '../../utils/sanitizeWhiteSpace';

// Components
import Button from './Button';
import Spinner from './Spinner';

// Icons
import CloseIcon from '../icons/CloseIcon';
import ArrowIcon from '../icons/ArrowIcon';

const SideSheet = ({ wrapper, className, children }) => {
  return wrapper ? (
    <article
      className={sanitizeWhiteSpace(`sidesheet ${className ? className : ''}`)}
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

const Header = ({ title, closeHandler, children }) => {
  return (
    <header className='sidesheet-header'>
      {closeHandler && (
        <Button
          className={'sidesheet-header-close-btn'}
          icon={<CloseIcon />}
          onClick={closeHandler}
        />
      )}
      {title && <h3 className='sidesheet-header-title'>{title}</h3>}
      {children && (
        <section className='sidesheet-header-content'>{children}</section>
      )}
    </header>
  );
};

Header.propTypes = {
  title: PropTypes.string,
  closeHandler: PropTypes.func,
};

const Content = ({
  elementType = 'article',
  id,
  className,
  onSubmit,
  children,
}) => {
  return createElement(
    elementType,
    {
      id,
      className: sanitizeWhiteSpace(
        `sidesheet-content ${className ? className : ''}`
      ),
      onSubmit,
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

const Footer = ({ className, children }) => {
  return (
    <footer
      className={sanitizeWhiteSpace(
        `sidesheet-footer ${className ? className : ''}`
      )}
    >
      {children}
    </footer>
  );
};

Footer.propTypes = {
  className: PropTypes.string,
};

const FooterButton = ({ text, requesting, form }) => {
  return (
    <Button
      className={'sidesheet-footer'}
      fill={'contained'}
      type={'primary'}
      block={true}
      blockBtnBottom={true}
      text={text}
      icon={
        requesting ? (
          <Spinner height={'1.5rem'} />
        ) : (
          <ArrowIcon direction={'right'} />
        )
      }
      disabled={requesting}
      submit={form ? true : false}
      form={form}
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
