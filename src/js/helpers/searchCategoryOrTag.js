
import isEmpty from 'lodash/isEmpty';
import escapeRegExp from 'lodash/escapeRegExp';

import { loadFromStorage } from 'js/helpers/webStorage';
import webStorageTypes from 'js/constants/webStorage.types';


/**
 * Search category or tag from webStorage
 * @param {String} type - Category or tag
 * @param {String} query - Search query
 * @returns {<Category[], Tag[]>}
 */
const search = (type, query) => {
  let list;

  switch (type) {
    case 'category':
      list = loadFromStorage(webStorageTypes.WEB_STORAGE_CATEGORIES_LIST);
      break;

    case 'tag':
      list = loadFromStorage(webStorageTypes.WEB_STORAGE_TAGS_LIST);
      break;

    default:
      return [];
  }

  if (isEmpty(list)) return [];

  if (query === 'ALL') {
    return list;
  } else {
    const regex = new RegExp(escapeRegExp(query));

    const match = list.filter(item => {
      return regex.exec(item.krName);
    });

    return match;
  }
}

export default search;
