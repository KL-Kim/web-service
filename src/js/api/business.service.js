import Promise from 'bluebird';
import fetch from 'cross-fetch';
import _ from 'lodash';

import config from '../config/config';

/**
 * Business serivce uri
 */
const businessSerivceUri = {
  getBuinessUrl: config.API_GATEWAY_ROOT + '/business'.
};
