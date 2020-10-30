import React, { useState, useRef } from 'react';
import PropTypes from 'prop-types';

// Components
import Button from './Button';

/* 
  const onChange = ({ name, value }) => 
    setFormData({ ...formData, [name]: value });
*/
const ImageInput = ({
  label,
  name,
  value,
  onChangeHandler,
  informationText,
  error,
  btnSmall = true,
}) => {
  const inputRef = useRef(null);
  const [fileInput, setFileInput] = useState('');

  const onClick = e => inputRef.current && inputRef.current.click();

  const onChange = e => {
    const file = e.target.files[0];
    const reader = new FileReader();
    reader.readAsDataURL(file);
    reader.onloadend = () => onChangeHandler({ name, value: reader.result });
    setFileInput(e.target.value);
  };

  return (
    <div className='image-input-group'>
      <div className='image-input'>
        <label>{label}</label>
        <Button
          fill={'contained'}
          type={'secondary'}
          text={'choose'}
          small={btnSmall}
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

      {(informationText || error) && (
        <p className={`input-${error ? 'error-' : ''}message`}>
          {error ? error : informationText}
        </p>
      )}

      {value && (
        <img className='image-input-preview' src={value} alt='input-preview' />
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
  error: PropTypes.string,
  btnSmall: PropTypes.bool,
};

export default ImageInput;
