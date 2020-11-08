import React, {
  useState,
  Fragment,
  forwardRef,
  useImperativeHandle,
} from 'react';
import PropTypes from 'prop-types';

import sanitizeWhiteSpace from '../../utils/sanitizeWhiteSpace';

const Flippable = forwardRef(
  (
    {
      wrapper = true,
      classes,
      frontClass,
      frontContent,
      backClass,
      backContent,
    },
    ref
  ) => {
    // true is front
    // false is back
    const [current, setCurrent] = useState(true);

    useImperativeHandle(ref, () => ({
      flip,
    }));

    const flip = () => setCurrent(!current);

    const content = (
      <Fragment>
        <article
          className={sanitizeWhiteSpace(
            `flippable-front-face ${current ? 'shown' : 'hidden'} ${
              frontClass ? frontClass : ''
            }`
          )}
        >
          {frontContent}
        </article>
        <article
          className={sanitizeWhiteSpace(
            `flippable-back-face ${current ? 'hidden' : 'shown'} ${
              backClass ? backClass : ''
            }`
          )}
        >
          {backContent}
        </article>
      </Fragment>
    );

    return wrapper ? (
      <article
        className={sanitizeWhiteSpace(
          `flippable-wrapper ${classes ? classes : ''}`
        )}
      >
        {content}
      </article>
    ) : (
      content
    );
  }
);

Flippable.propTypes = {
  wrapper: PropTypes.bool,
  classes: PropTypes.string,
  frontClass: PropTypes.string,
  frontContent: PropTypes.oneOfType([PropTypes.element, PropTypes.string]),
  backClass: PropTypes.string,
  backContent: PropTypes.oneOfType([PropTypes.element, PropTypes.string]),
};

export default Flippable;
