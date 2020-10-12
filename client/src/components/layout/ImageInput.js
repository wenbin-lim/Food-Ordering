import React, { useState, useEffect, useRef } from 'react';
import PropTypes from 'prop-types';

// Components
import Button from './Button';

/* 
  =====
  Props
  =====
  1. label 
  @type       string
  @desc       label of input group
  @required   false
  
  2. name
  @type       string
  @desc       name of this input
  @required   true

  3. value
  @type       boolean
  @desc       value of this input
  @required   true

  4. onChangeHandler
  @type       function
  @desc       to update the form data
  @example

  const onChange = ({ name, value }) => {
    setFormData({ ...formData, [name]: value });
  };

  @required   true

  5. informationText
  @type       string
  @desc       information text that is displayed below input field
  @required   false

  6. validity 
  @type       boolean
  @desc       shows if field is valid or invalid
  @desc       should be passed down from Parent error checking
  @required   true
  @default    true

  7. errorMessage 
  @type       string
  @desc       displays error message below input field
  @required   true if validity is false
*/
const ImageInput = ({
  label,
  name,
  value,
  onChangeHandler,
  informationText,
  validity,
  errorMessage,
}) => {
  const inputRef = useRef(null);
  const [fileInput, setFileInput] = useState('');
  const [imagePreview, setImagePreview] = useState();

  const onClick = e => {
    if (inputRef.current) {
      inputRef.current.click();
    }
  };

  const onChange = e => {
    const file = e.target.files[0];
    const reader = new FileReader();
    reader.readAsDataURL(file);
    reader.onloadend = () => {
      setImagePreview(reader.result);
    };

    setFileInput(e.target.value);
  };

  useEffect(() => {
    if (imagePreview) {
      onChangeHandler({ name, value: imagePreview });
    }
  }, [imagePreview]);

  useEffect(() => {
    setImagePreview(value);
  }, [value]);

  return (
    <div className='image-input-group'>
      <div className='image-input'>
        <label>{label}</label>
        <Button
          btnStyle={'contained'}
          type={'secondary'}
          text='choose'
          onClick={onClick}
        />
        <input
          type='file'
          name={name}
          onChange={onChange}
          value={fileInput}
          ref={inputRef}
        />
      </div>
      {validity ? (
        <p className='image-input-message'>{informationText}</p>
      ) : (
        <p className='image-input-message error-message'>{errorMessage}</p>
      )}
      {imagePreview && (
        <img
          className='image-input-preview'
          src={imagePreview}
          alt='preview-image'
        />
      )}
    </div>
  );
};

ImageInput.propTypes = {
  label: PropTypes.string,
  name: PropTypes.string.isRequired,
  value: PropTypes.string.isRequired,
  onChangeHandler: PropTypes.func.isRequired,
  informationText: PropTypes.string,
  validity: PropTypes.bool.isRequired,
  errorMessage: (props, propName) => {
    if (!props['validity'] && typeof props[propName] !== 'string') {
      return new Error(
        'errorMessage cannot be empty if validity is false. errorMessage must be a string type.'
      );
    }
  },
};

export default ImageInput;
