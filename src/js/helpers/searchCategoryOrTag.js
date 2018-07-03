import _ from 'lodash';

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

  let matchList = [];

  const regex = new RegExp(query);

  list.map(item => {
    if (regex.exec(item.krName)) {
      matchList.push(item);
    }
  });

  return matchList;
}

export default search;
