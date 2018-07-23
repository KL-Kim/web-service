/**
 * WebStorage Utilities
 *
 * @since 0.0.1
 */

/**
* Load state from localStorage
*/
export const loadFromStorage = (item) => {
  try {
    return JSON.parse(localStorage.getItem(item));
  } catch(err) {
    return null;
  }
};

/**
* Set state from localStorage
*/
export const saveToStorage = (item, state) => {
  try {
    localStorage.setItem(item, JSON.stringify(state));
    return ;
  } catch(err) {
    return null;
  }
};

/**
* Remove state from localStorage
*/
export const removeFromStorage = (item) => {
  try {
    localStorage.removeItem(item);
    return ;
  } catch(err) {
    return null;
  }
};
