import { useEffect, createElement } from 'react';
import PropTypes from 'prop-types';
import { useSelector } from 'react-redux';

import sanitizeWhiteSpace from '../../utils/sanitizeWhiteSpace';

const Container = ({
  elementType = 'section',
  className,
  style,
  sidesheet,
  children,
}) => {
  return createElement(
    elementType,
    {
      className: sanitizeWhiteSpace(
        `container ${sidesheet ? `enable-sidesheet` : ''} ${
          className ? className : ''
        }`
      ),
      style: {
        ...style,
      },
    },
    children
  );
};

Container.propTypes = {
  elementType: PropTypes.string,
  className: PropTypes.string,
  gridLayout: PropTypes.arrayOf(PropTypes.number),
};

// default size from defined class is flex-grow = 1
const Parent = ({
  elementType = 'article',
  className,
  style,
  size,
  children,
}) => {
  return createElement(
    elementType,
    {
      className: sanitizeWhiteSpace(
        `container-parent ${className ? className : ''}`
      ),
      style: {
        ...style,
        flex: typeof size === 'number' && size > 0 ? size : null,
      },
    },
    children
  );
};

Parent.propTypes = {
  elementType: PropTypes.string,
  className: PropTypes.string,
};

// default size from defined class is flex-grow = 1
const Child = ({
  elementType = 'article',
  className,
  style,
  size,
  children,
}) => {
  const screenOrientation = useSelector(state => state.app.screenOrientation);

  useEffect(() => {
    document.body.style.overflow =
      screenOrientation && children ? 'hidden' : 'auto';
  }, [children]);

  return createElement(
    elementType,
    {
      className: sanitizeWhiteSpace(
        `container-child ${className ? className : ''}`
      ),
      style: {
        ...style,
        flex: typeof size === 'number' && size > 0 ? size : null,
      },
    },
    children
  );
};

Child.propTypes = {
  elementType: PropTypes.string,
  className: PropTypes.string,
};

Container.Parent = Parent;
Container.Child = Child;

export default Container;
