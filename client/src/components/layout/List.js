import React, { useState, cloneElement, Children } from 'react';
import PropTypes from 'prop-types';

// Components
import SearchInput from './SearchInput';
import ListPreloader from '../preloaders/ListPreloader';

// Misc
import { v4 as uuid } from 'uuid';
import sanitizeWhiteSpace from '../../utils/sanitizeWhiteSpace';

// Hooks
import useSearch from '../../hooks/useSearch';

const List = ({
  className,
  enableSearch = true,
  searchQueryFields = ['name'],
  searchCaseSensitive = false,
  children,
}) => {
  const [searchQuery, setSearchQuery] = useState('');

  const items = Children.toArray(children).find(({ type }) => type === Items);

  return (
    <article
      className={sanitizeWhiteSpace(`list ${className ? className : ''}`)}
    >
      {(Children.toArray(children).find(({ type }) => type === Header) ||
        enableSearch) && (
        <header className='list-header'>
          {Children.toArray(children).find(({ type }) => type === Header)}
          {enableSearch && (
            <section className='list-header-search'>
              <SearchInput onSearch={query => setSearchQuery(query)} />
            </section>
          )}
        </header>
      )}

      {items &&
        cloneElement(items, {
          searchQuery,
          enableSearch,
          searchQueryFields,
          searchCaseSensitive,
        })}

      {Children.map(
        children,
        child => child?.type !== Header && child?.type !== Items && child
      )}
    </article>
  );
};

List.propTypes = {
  className: PropTypes.string,
  enableSearch: PropTypes.bool,
  searchQueryFields: PropTypes.arrayOf(PropTypes.string),
  searchCaseSensitive: PropTypes.bool,
};

const Header = ({ title, className, children, ...rest }) => {
  return (
    <section
      className={sanitizeWhiteSpace(
        `list-header-left ${className ? className : ''}`
      )}
      {...rest}
    >
      <h1 className='list-title'>{title}</h1>
      {children && <div className='list-header-left-children'>{children}</div>}
    </section>
  );
};

Header.propTypes = {
  title: PropTypes.oneOfType([PropTypes.string, PropTypes.element]),
  className: PropTypes.string,
};

const Items = ({
  className,
  loading,
  error,
  array,
  itemElement,
  // passed down from List
  enableSearch,
  searchQueryFields,
  searchCaseSensitive,
  searchQuery,
}) => {
  const filteredArray = useSearch(
    array,
    searchQuery,
    searchQueryFields,
    searchCaseSensitive
  );

  return (
    <section
      className={sanitizeWhiteSpace(`list-items ${className ? className : ''}`)}
    >
      {loading || error ? (
        <ListPreloader />
      ) : enableSearch ? (
        Array.isArray(filteredArray) && filteredArray.length > 0 ? (
          filteredArray.map((item, index) =>
            cloneElement(itemElement, {
              key: item?.id ? item.id : uuid(),
              data: item,
              index: index + 1,
            })
          )
        ) : (
          <p className='caption text-center'>Nothing found</p>
        )
      ) : Array.isArray(array) && array.length > 0 ? (
        array.map((item, index) =>
          cloneElement(itemElement, {
            key: item?.id ? item.id : uuid(),
            data: item,
            index: index + 1,
          })
        )
      ) : (
        <p className='caption text-center'>Nothing found</p>
      )}
    </section>
  );
};

Items.propTypes = {
  className: PropTypes.string,
  loading: PropTypes.bool,
  error: PropTypes.object,
  array: PropTypes.array,
  itemElement: PropTypes.element,
};

List.Header = Header;
List.Items = Items;

export default List;
