import { useEffect, createElement } from 'react';
import PropTypes from 'prop-types';
import { useSelector } from 'react-redux';

import sanitizeWhiteSpace from '../../utils/sanitizeWhiteSpace';

const Container = ({
  elementType = 'section',
  className,
  sidesheet,
  children,
  ...rest
}) => {
  return createElement(
    elementType,
    {
      className: sanitizeWhiteSpace(
        `container ${sidesheet ? `enable-sidesheet` : ''} ${
          className ? className : ''
        }`
      ),
      ...rest,
    },
    children
  );
};

Container.propTypes = {
  elementType: PropTypes.string,
  className: PropTypes.string,
  sidesheet: PropTypes.bool,
};

// default size from defined class is flex-grow = 1
const Parent = ({
  elementType = 'article',
  className,
  style,
  size,
  children,
  ...rest
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
      ...rest,
    },
    children
  );
};

Parent.propTypes = {
  elementType: PropTypes.string,
  className: PropTypes.string,
  style: PropTypes.object,
  size: PropTypes.number,
};

// default size from defined class is flex-grow = 1
const Child = ({
  elementType = 'article',
  className,
  style,
  size,
  children,
  ...rest
}) => {
  const screenOrientation = useSelector(state => state.app.screenOrientation);

  useEffect(() => {
    document.body.style.overflow =
      screenOrientation && children ? 'hidden' : 'auto';

    return () => {
      document.body.style.overflow = 'auto';
    };
  }, [screenOrientation, children]);

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
      ...rest,
    },
    children
  );
};

Child.propTypes = {
  elementType: PropTypes.string,
  className: PropTypes.string,
  style: PropTypes.object,
  size: PropTypes.number,
};

Container.Parent = Parent;
Container.Child = Child;

export default Container;
