import React, { useEffect } from 'react';
import PropTypes from 'prop-types';

// Icons
import SearchIcon from '../icons/SearchIcon';

/* 
  const [filteredResults, setFilteredResults] = useState([]);
  const onSearch = filteredResult => setFilteredResults(filteredResult);
*/

const SearchInput = ({
  label,
  name,
  array,
  onSearch,
  queryFields,
  placeholder,
}) => {
  useEffect(() => {
    // init filteredResults first
    onSearch(array);

    // eslint-disable-next-line
  }, [array]);

  const onChange = e => {
    const queryStr = e.target.value.toLowerCase();

    let filteredResult = array.filter(el => {
      let found = false;
      queryFields.forEach(field => {
        if (
          typeof el[field] === 'string' &&
          el[field].toLowerCase().indexOf(queryStr) >= 0
        ) {
          found = true;
        } else if (Array.isArray(el[field])) {
          el[field].forEach(el => {
            if (
              typeof el === 'string' &&
              el.toLowerCase().indexOf(queryStr) >= 0
            ) {
              found = true;
            }
          });
        }
      });
      return found;
    });

    onSearch(filteredResult);
  };

  return (
    <div className='input-group'>
      <label htmlFor={name}>{label}</label>

      <div className={'input-field append-icon'}>
        <input
          name={name}
          type={'text'}
          onChange={onChange}
          placeholder={placeholder ? placeholder : null}
        />

        <div className='input-field-icon'>
          <SearchIcon />
        </div>
      </div>
    </div>
  );
};
SearchInput.propTypes = {
  label: PropTypes.string,
  name: PropTypes.string.isRequired,
  onSearch: PropTypes.func.isRequired,
  queryFields: PropTypes.arrayOf(PropTypes.string).isRequired,
  placeholder: PropTypes.string,
};

export default SearchInput;
