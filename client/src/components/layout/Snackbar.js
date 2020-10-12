import React, { useRef } from 'react';
import { connect } from 'react-redux';
import PropTypes from 'prop-types';

// Actions
import { removeSnackbar } from '../../actions/app';
/* 
  =====
  Props
  =====
  @name       snackbars
  @type       array of snackbar
  @desc       from App level appp state 
  @required   true

  @name       removeSnackbar
  @type       function
  @desc       to remove snackbar on click
  @required   true
*/

// Todo add actions in snackbar
export const Snackbar = ({ snackbars, removeSnackbar }) => {
  const snackbarsRef = useRef([]);

  const swipeToRemove = (e, id) => {
    // touchstart begins
    const snackbar = snackbarsRef.current[id];
    const initialX = e.touches[0].clientX;
    let distanceMoved = 0;

    // add event listener for touchmove to move the snackbar
    // touchmove function
    const handleTouchMove = touchmoveEvt => {
      let newX = touchmoveEvt.touches[0].clientX;
      distanceMoved = initialX - newX;
      snackbar.style.transform = `translateX(${-distanceMoved}px)`;
      snackbar.style.opacity = `${1 - Math.abs(distanceMoved) / 100}`;
    };

    const handleTouchEnd = touchendEvt => {
      if (touchendEvt.cancelable) {
        touchendEvt.preventDefault();
      }

      if (Math.abs(distanceMoved) > 60) {
        // remove this snackbar
        removeSnackbar(id);
      } else {
        // return snackbar back to original pos
        snackbar.style.transform = `translateX(0px)`;
        snackbar.style.opacity = 1;
      }
    };

    snackbar.addEventListener('touchmove', handleTouchMove);
    snackbar.addEventListener('touchend', handleTouchEnd);
  };

  return (
    <div className='snackbar-wrapper'>
      {snackbars.map(snackbar => (
        <div
          className={`snackbar snackbar-${snackbar.type}`}
          key={snackbar.id}
          ref={el => (snackbarsRef.current[snackbar.id] = el)}
          onTouchStart={e => swipeToRemove(e, snackbar.id)}
          onClick={e => removeSnackbar(snackbar.id)}
        >
          {snackbar.msg}
        </div>
      ))}
    </div>
  );
};

Snackbar.propTypes = {
  snackbars: PropTypes.array.isRequired,
  removeSnackbar: PropTypes.func.isRequired,
};

const mapStateToProps = state => ({
  snackbars: state.app.snackbars,
});

const mapDispatchToProps = {
  removeSnackbar,
};

export default connect(mapStateToProps, mapDispatchToProps)(Snackbar);
