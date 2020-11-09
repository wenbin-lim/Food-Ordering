import { useState, useEffect } from 'react';

// array can be array of objects, array of array or array of string
// queryFields is only applicable for array of objects
// queryFields is an array
// can only search for strings
export default function useSearch(
  array,
  query,
  queryFields,
  caseSensitive = false
) {
  const [filtered, setFiltered] = useState(Array.isArray(array) ? array : []);

  useEffect(() => {
    if (Array.isArray(array)) {
      setFiltered(array);
    }
  }, [array]);

  useEffect(() => {
    let queryStr = caseSensitive ? query : query.toLowerCase();

    if (Array.isArray(array)) {
      let newFiltered = array.filter(item => {
        let found = false;

        // check if item is object/array/string
        if (typeof item === 'object' && item !== null) {
          queryFields.forEach(field => {
            let itemOfField = item[field];

            if (typeof itemOfField === 'string') {
              let itemOfFieldStr = caseSensitive
                ? itemOfField
                : itemOfField.toLowerCase();
              found = itemOfFieldStr.indexOf(queryStr) >= 0;
            } else if (Array.isArray(itemOfField)) {
              let itemOfFieldArr = itemOfField;

              itemOfFieldArr.forEach(itemOfFieldEl => {
                if (typeof itemOfFieldEl === 'string') {
                  let itemOfFieldElStr = caseSensitive
                    ? itemOfFieldEl
                    : itemOfFieldEl.toLowerCase();
                  found = itemOfFieldElStr.indexOf(queryStr) >= 0;
                }
              });
            }
          });
        } else if (Array.isArray(item)) {
          item.forEach(el => {
            if (typeof el === 'string') {
              let elStr = caseSensitive ? el : el.toLowerCase();
              found = elStr.indexOf(queryStr) >= 0;
            }
          });
        } else if (typeof item === 'string') {
          let itemStr = caseSensitive ? item : item.toLowerCase();
          found = itemStr.indexOf(queryStr) >= 0;
        }

        return found;
      });

      setFiltered(newFiltered);
    }
  }, [query]);

  return filtered;
}
