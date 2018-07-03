/**
 * Save search history
 *
 * @version 0.0.1
 */

import { loadFromStorage, saveToStorage } from 'js/helpers/webStorage';
import webStorageTypes from 'js/constants/webStorage.types';

const saveSearchHistory = (query) => {
  let history = loadFromStorage(webStorageTypes.WEB_STORAGE_SEARCH_HISTORY);

  if (!Array.isArray(history)) {
    history = [];
  } else {
    const index = history.indexOf(query);

    if (index > -1) {
      history.splice(index, 1);
    }
  }

  history.push(query);

  if (history.length > 5) {
    history.shift();
  }
  saveToStorage(webStorageTypes.WEB_STORAGE_SEARCH_HISTORY, history);

  return history;
}

export default saveSearchHistory;
