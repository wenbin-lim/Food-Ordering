import React, { Fragment } from 'react';
import PropTypes from 'prop-types';
import { connect } from 'react-redux';

import sanitizeWhiteSpace from '../../utils/sanitizeWhiteSpace';

// Components
import Button from './Button';

// Icons
import ArrowIcon from '../icons/ArrowIcon';
import CloseIcon from '../icons/CloseIcon';

const SideSheet = ({
  wrapper = true,
  classes,
  headerTitle,
  closeSideSheetHandler,
  headerContent,
  // headerMoreActions,
  contentWrapper = true,
  contentClass,
  content,
  footerBtn,
  screenOrientation,
}) => {
  const sideSheetContent = (
    <Fragment>
      <header className='sidesheet-header'>
        {closeSideSheetHandler && (
          <Button
            classes={'sidesheet-header-close-btn'}
            icon={screenOrientation ? <ArrowIcon /> : <CloseIcon />}
            onClick={closeSideSheetHandler}
          />
        )}
        {headerTitle && (
          <h2 className='sidesheet-header-title'>{headerTitle}</h2>
        )}
        {headerContent && (
          <div className='sidesheet-header-content'>{headerContent}</div>
        )}
      </header>
      {contentWrapper ? (
        <article
          className={sanitizeWhiteSpace(
            `sidesheet-content ${contentClass ? contentClass : ''}`
          )}
        >
          {content}
        </article>
      ) : (
        content
      )}
      {footerBtn && <footer className='sidesheet-footer'>{footerBtn}</footer>}
    </Fragment>
  );

  return wrapper ? (
    <article
      className={sanitizeWhiteSpace(`sidesheet ${classes ? classes : ''}`)}
    >
      {sideSheetContent}
    </article>
  ) : (
    sideSheetContent
  );
};

SideSheet.propTypes = {
  wrapper: PropTypes.bool,
  classes: PropTypes.string,
  headerTitle: PropTypes.string,
  closeSideSheetHandler: PropTypes.func,
  headerContent: PropTypes.element,
  // headerMoreActions,
  contentWrapper: PropTypes.bool,
  contentClass: PropTypes.string,
  content: PropTypes.element,
  footerBtn: PropTypes.element,
};

const mapStateToProps = state => ({
  screenOrientation: state.app.screenOrientation,
});

const mapDispatchToProps = {};

export default connect(mapStateToProps, mapDispatchToProps)(SideSheet);
