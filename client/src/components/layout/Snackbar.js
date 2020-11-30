import React from 'react';
import { connect } from 'react-redux';
import PropTypes from 'prop-types';
import { useDrag } from 'react-use-gesture';

// Animations
import { TweenMax } from 'gsap';

// Components
import Button from './Button';

// Actions
import { removeSnackbar } from '../../actions/app';

/* 
  snackbarObj
  msg: String,
  type: String of 'primary', 'secondary', 'error', 'success', 'warning'
  action: {
    name: String,
    callback: function
  }
  timeout: Number 
*/
export const Snackbar = ({ snackbars, removeSnackbar }) => {
  const onDrag = useDrag(
    ({ event, down, movement: [movementX] }) => {
      event.stopPropagation();

      const minSwipeDist = 60;
      const target = event.target;
      const snackbarId = target.id;
      const snackbar = document.getElementById(snackbarId);

      if (snackbar) {
        if (down) {
          if (movementX < 0) {
            snackbar.style.transform = `translateX(${movementX}px)`;
            snackbar.style.opacity = `${1 - Math.abs(movementX) / 100}`;

            document.body.style.overflow = 'hidden';
          }
        } else {
          if (movementX < 0) {
            if (Math.abs(movementX) < minSwipeDist) {
              TweenMax.fromTo(
                snackbar,
                0.1,
                {
                  x: movementX,
                  opacity: 1 - Math.abs(movementX) / 100,
                },
                { x: 0, opacity: 1 }
              );
            } else {
              removeSnackbar(snackbar.id);
            }
            document.body.style.overflow = 'auto';
          }
        }
      }
    },
    { axis: 'x', eventOptions: { passive: false } }
  );

  const snackbarActionHandler = (e, id, callback) => {
    e.stopPropagation();

    if (typeof callback === 'function') {
      callback();
    }
    removeSnackbar(id);
  };

  return (
    <div className='snackbar-wrapper'>
      {snackbars.map(({ id, type, msg, action }) => (
        <div
          id={id}
          key={id}
          className={`snackbar snackbar-${type}`}
          {...onDrag()}
        >
          {msg}
          {action && (
            <Button
              classes='snackbar-action-btn'
              small={true}
              text={action.name}
              onClick={e => snackbarActionHandler(e, id, action.callback)}
            />
          )}
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
