import React, { useState, Fragment, cloneElement } from 'react';
import PropTypes from 'prop-types';

// Components
import Button from './Button';
import SearchInput from './SearchInput';
import ListPreloader from '../preloaders/ListPreloader';

// Icons
import PlusIcon from '../icons/PlusIcon';

// Misc
import { v4 as uuid } from 'uuid';
import sanitizeWhiteSpace from '../../utils/sanitizeWhiteSpace';

// Hooks
import useSearch from '../../hooks/useSearch';

const List = ({
  wrapper,
  className,
  title,
  loading,
  error,
  listClassName,
  listArr,
  enableSearch = true,
  searchQueryFields = ['name'],
  searchCaseSensitive = false,
  listItem,
  addBtnCallback,
}) => {
  const [searchQuery, setSearchQuery] = useState('');
  const filteredListArr = useSearch(
    listArr,
    searchQuery,
    searchQueryFields,
    searchCaseSensitive
  );

  const onSearch = query => setSearchQuery(query);

  const listContent = (
    <Fragment>
      {(title || enableSearch) && (
        <header className='list-header'>
          {title && <h3 className='list-header-title'>{title}</h3>}
          {enableSearch && (
            <div className='list-header-right'>
              <SearchInput name='search' onSearch={onSearch} />
            </div>
          )}
        </header>
      )}

      <article
        className={sanitizeWhiteSpace(
          `list ${listClassName ? listClassName : ''}`
        )}
      >
        {loading || error ? (
          <ListPreloader />
        ) : enableSearch ? (
          filteredListArr.length > 0 ? (
            filteredListArr.map((data, index) =>
              cloneElement(listItem, {
                key: data._id ? data._id : uuid(),
                data,
                index: index + 1,
              })
            )
          ) : (
            <p className='caption text-center'>Nothing found</p>
          )
        ) : listArr.length > 0 ? (
          listArr.map((data, index) =>
            cloneElement(listItem, {
              key: data._id ? data._id : uuid(),
              data,
              index: index + 1,
            })
          )
        ) : (
          <p className='caption text-center'>Nothing found</p>
        )}
      </article>

      {addBtnCallback && (
        <Button
          className={'list-add-btn'}
          fill={'contained'}
          type={'primary'}
          icon={<PlusIcon />}
          onClick={addBtnCallback}
        />
      )}
    </Fragment>
  );

  return wrapper ? (
    <article
      className={sanitizeWhiteSpace(
        `list-wrapper ${className ? className : ''}`
      )}
    >
      {listContent}
    </article>
  ) : (
    listContent
  );
};

List.propTypes = {
  wrapper: PropTypes.bool,
  className: PropTypes.string,
  title: PropTypes.string,
  loading: PropTypes.bool,
  error: PropTypes.object,
  listClassName: PropTypes.string,
  listArr: PropTypes.array,
  enableSearch: PropTypes.bool,
  searchQueryFields: PropTypes.arrayOf(PropTypes.string),
  searchCaseSensitive: PropTypes.bool,
  listItem: PropTypes.element,
  addBtnCallback: PropTypes.func,
};

export default List;
