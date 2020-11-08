import React, { useRef } from 'react';
import PropTypes from 'prop-types';
import { connect } from 'react-redux';

// Components
import Dialog from '../layout/Dialog';
import Food from './Food';

const FoodDialog = ({ food, edit, fullscreen, unmountHandler }) => {
  const dialogRef = useRef(null);

  const closeDialog = () =>
    dialogRef.current && dialogRef.current.closeDialog();

  return (
    <Dialog
      ref={dialogRef}
      classes={'flippable-wrapper food'}
      content={<Food food={food} edit={edit} unmountHandler={closeDialog} />}
      fullscreen={fullscreen}
      unmountDialogHandler={unmountHandler}
    />
  );
};

FoodDialog.propTypes = {
  food: PropTypes.object.isRequired,
  edit: PropTypes.object,
  fullscreen: PropTypes.bool.isRequired,
  unmountHandler: PropTypes.func.isRequired,
};

const mapStateToProps = state => ({});

const mapDispatchToProps = {};

export default connect(mapStateToProps, mapDispatchToProps)(FoodDialog);
