import React, {
  useState,
  useEffect,
  useRef,
  forwardRef,
  useImperativeHandle,
} from 'react';
import { createPortal } from 'react-dom';

const Scrim = ({ elementType = 'div', children }) => {
  const [scrim] = useState(document.createElement(elementType));
  scrim.classList.add('scrim');

  useEffect(() => {
    document.body.appendChild(scrim);
    // document.body.style.overflow = 'hidden';

    return () => {
      document.body.removeChild(scrim);
      // document.body.style.overflow = 'auto';
    };
  }, []);

  return createPortal(children, scrim);
};

export default Scrim;
