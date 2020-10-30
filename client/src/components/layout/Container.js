import React, { Fragment } from 'react';
import PropTypes from 'prop-types';
import { connect } from 'react-redux';

import sanitizeWhiteSpace from '../../utils/sanitizeWhiteSpace';

const Container = ({
  parentContent,
  childContent,
  parentSize,
  childSize,
  parentClass,
  childClass,
  parentStyle,
  childStyle,
  screenOrientation,
}) => {
  return (
    <section
      className={sanitizeWhiteSpace(
        `container ${
          childContent ? 'with-child' : `${parentClass ? parentClass : ''}`
        }`
      )}
      style={!childContent ? parentStyle : null}
    >
      {!childContent ? (
        parentContent
      ) : (
        <Fragment>
          <article
            className={sanitizeWhiteSpace(
              `parent ${parentClass ? parentClass : ''}`
            )}
            style={{
              ...parentStyle,
              flex: !screenOrientation && parentSize ? parentSize : null,
            }}
          >
            {parentContent}
          </article>
          <article
            className={sanitizeWhiteSpace(
              `child ${childClass ? childClass : ''}`
            )}
            style={{
              ...childStyle,
              flex: !screenOrientation && childSize ? childSize : null,
            }}
          >
            {childContent}
          </article>
        </Fragment>
      )}
    </section>
  );
};

Container.propTypes = {
  parentContent: PropTypes.oneOfType([PropTypes.element, PropTypes.string])
    .isRequired,
  childContent: PropTypes.oneOfType([PropTypes.element, PropTypes.string]),
  parentSize: PropTypes.number,
  childSize: PropTypes.number,
  parentClass: PropTypes.string,
  childClass: PropTypes.string,
  parentStyle: PropTypes.object,
  childStyle: PropTypes.object,
  screenOrientation: PropTypes.bool.isRequired,
};

const mapStateToProps = state => ({
  screenOrientation: state.app.screenOrientation,
});

const mapDispatchToProps = {};

export default connect(mapStateToProps, mapDispatchToProps)(Container);
