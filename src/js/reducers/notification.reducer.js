/**
 * Notification Reducer
 */
import notificationTypes from '../constants/notification.types';

const initialState = {
  list: [],
  unreadCount: 0,
  totalCount: 0,
  isFetching: false,
  error: null,
};

const notificationReducer = (state = initialState, action) => {
  switch (action.type) {
    case notificationTypes.CLEAR_NOTIFICATION_LIST:
      return initialState;

    case notificationTypes.GET_NOTIFICATION_REQUEST:
    case notificationTypes.GET_UNREAD_COUNT_REQUEST:
    case notificationTypes.DELETE_NOTIFICATION_REQUEST:
    case notificationTypes.CLEAR_READ_NOTIFICATION_REQUEST:
      return {
        ...state,
        isFetching: true,
        error: null,
      };

    case notificationTypes.GET_NOTIFICATION_FAILURE:
    case notificationTypes.GET_UNREAD_COUNT_FAILURE:
    case notificationTypes.DELETE_NOTIFICATION_FAILURE:
    case notificationTypes.CLEAR_READ_NOTIFICATION_FAILURE:
      return {
        ...state,
        isFetching: false,
        error: action.error,
      };

    case notificationTypes.GET_NOTIFICATION_SUCCESS:
      return {
        ...state,
        list: [...action.payload.list],
        totalCount: action.payload.totalCount,
        unread: action.payload.unread,
      };
    
    case notificationTypes.GET_UNREAD_COUNT_SUCCESS:
      return {
        ...state,
        isFetching: false,
        unreadCount: action.payload.unreadCount,
      };
    
    case notificationTypes.DELETE_NOTIFICATION_SUCCESS:
      return {
        ...state,
        isFetching: false,
      };

    case notificationTypes.CLEAR_READ_NOTIFICATION_SUCCESS:
      return {...initialState};

    default:
      return state;
  }
}

export default notificationReducer;
