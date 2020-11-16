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
        // check if item is object/array/string
        if (typeof item === 'object' && item !== null) {
          for (var i = 0; i < queryFields.length; i++) {
            let itemOfField = item[queryFields[i]];

            if (typeof itemOfField === 'string') {
              let itemOfFieldStr = caseSensitive
                ? itemOfField
                : itemOfField.toLowerCase();

              if (itemOfFieldStr.indexOf(queryStr) >= 0) {
                return true;
              }
            } else if (Array.isArray(itemOfField)) {
              for (var j = 0; j < itemOfField.length; j++) {
                let itemOfFieldEl = itemOfField[j];

                if (typeof itemOfFieldEl === 'string') {
                  let itemOfFieldElStr = caseSensitive
                    ? itemOfFieldEl
                    : itemOfFieldEl.toLowerCase();

                  if (itemOfFieldElStr.indexOf(queryStr) >= 0) {
                    return true;
                  }
                }
              }
            }
          }
        } else if (Array.isArray(item)) {
          for (var k = 0; k < item.length; k++) {
            let itemEl = item[k];

            if (typeof itemEl === 'string') {
              let itemElStr = caseSensitive ? itemEl : itemEl.toLowerCase();

              if (itemElStr.indexOf(queryStr) >= 0) {
                return true;
              }
            }
          }
        } else if (typeof item === 'string') {
          let itemStr = caseSensitive ? item : item.toLowerCase();

          if (itemStr.indexOf(queryStr) >= 0) {
            return true;
          }
        }
        return false;
      });

      setFiltered(newFiltered);
    }

    // eslint-disable-next-line
  }, [query]);

  return filtered;
}
