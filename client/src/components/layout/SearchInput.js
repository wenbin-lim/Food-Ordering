import React from 'react';
import PropTypes from 'prop-types';

// Icons
import SearchIcon from '../icons/SearchIcon';

/* 
  const [searchQuery, setSearchQuery] = useState('');
  const filteredListArr = useSearch(
    listArr,
    searchQuery,
    searchQueryFields,
    searchCaseSensitive
  );

  const onSearch = query => setSearchQuery(query);
*/

const SearchInput = ({ onSearch, placeholder }) => {
  const onChange = e => onSearch(e.target.value);

  return (
    <div className='input-group'>
      <div className={'input-field append-icon'}>
        <input
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
  onSearch: PropTypes.func.isRequired,
  placeholder: PropTypes.string,
};

export default SearchInput;
