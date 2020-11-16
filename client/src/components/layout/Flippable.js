import React, {
  useState,
  Fragment,
  forwardRef,
  useImperativeHandle,
  Children,
  createElement,
  cloneElement,
} from 'react';
import PropTypes from 'prop-types';

import sanitizeWhiteSpace from '../../utils/sanitizeWhiteSpace';

const Flippable = forwardRef(
  (
    { wrapper = true, elementType = 'article', className, children, ...rest },
    ref
  ) => {
    const flippableChildren = Children.toArray(children);
    // true is front
    // false is back
    const [currentFace, setCurrentFace] = useState(true);

    useImperativeHandle(ref, () => ({
      flip,
    }));

    const flip = () => setCurrentFace(!currentFace);

    const front = flippableChildren.find(({ type }) => type === Front);
    const back = flippableChildren.find(({ type }) => type === Back);

    return wrapper ? (
      <article
        className={`flippable-wrapper ${className ? className : ''}`}
        {...rest}
      >
        {front &&
          cloneElement(front, {
            shown: currentFace,
          })}
        {back &&
          cloneElement(back, {
            shown: !currentFace,
          })}
      </article>
    ) : (
      <Fragment>
        {front &&
          cloneElement(front, {
            shown: currentFace,
          })}
        {back &&
          cloneElement(back, {
            shown: !currentFace,
          })}
      </Fragment>
    );
  }
);

Flippable.propTypes = {
  wrapper: PropTypes.bool,
  elementType: PropTypes.string,
  className: PropTypes.string,
};

const Front = ({
  elementType = 'article',
  className,
  shown,
  children,
  ...rest
}) => {
  return createElement(
    elementType,
    {
      className: sanitizeWhiteSpace(
        `flippable-front-face 
      ${className ? className : ''}
      ${shown ? 'shown' : 'hidden'}
      `
      ),
      ...rest,
    },
    children
  );
};

Front.propTypes = {
  elementType: PropTypes.string,
  className: PropTypes.string,
  shown: PropTypes.bool,
};

const Back = ({
  elementType = 'article',
  className,
  shown,
  children,
  ...rest
}) => {
  return createElement(
    elementType,
    {
      className: sanitizeWhiteSpace(
        `flippable-back-face 
      ${className ? className : ''}
      ${shown ? 'shown' : 'hidden'}
      `
      ),
      ...rest,
    },
    children
  );
};

Back.propTypes = {
  elementType: PropTypes.string,
  className: PropTypes.string,
  shown: PropTypes.bool,
};

Flippable.Front = Front;
Flippable.Back = Back;

export default Flippable;
