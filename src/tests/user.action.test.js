import configureMockStore from 'redux-mock-store';
import thunk from 'redux-thunk';
import { login, register } from '../js/actions/user.actions';
import userTypes from '../js/constants/user.types';
import alertTypes from '../js/constants/alert.types';
import fetchMock from 'fetch-mock';
import { expect } from 'chai';
import uuidv4 from 'uuid/v4';

const middlewares = [thunk];
const mockStore = configureMockStore(middlewares);

const userContent = {
  "user": {
    "role": "regular",
    "point": 0,
    "userStatus": "normal",
    "isVerified": true,
    "profilePhotoUri": "",
    "lastLoginAt": "2018-03-02T08:50:06.008Z",
    "createdAt": "2018-03-01T13:23:30.895Z",
    "_id": "5a97fed2d6d28628efff8f16",
    "username": "jinguanglong11",
    "email": "jinguanglong11@hotmail.com",
    "lastLoginIp": "::1",
    "address": "Bla bla bla",
    "gender": "male",
    "lastName": "Kim",
    "firstName": "Tony"
  },
  token: ''
};

describe('User Actions', () => {
  describe('Login', () => {
    beforeEach(() => {
      global.sessionStorage = jest.genMockFunction();
      global.sessionStorage.setItem = jest.genMockFunction();
      global.sessionStorage.getItem = jest.genMockFunction();
    })

    afterEach(() => {
      fetchMock.reset();
      fetchMock.restore();
    });

    it('should login successfully and alert success when email and password is match', () => {
      const credentials = {
        email: "jinguanglong11@hotmail.com",
        password: '1234567890'
      };

      const alertContent = {
        id: uuidv4(),
        message: 'Login Successfully'
      };

      const expectedActions = [
        {
          type: userTypes.LOGIN_REQUEST,
          meta: {},
          error: null,
          payload: {}
        },
        {
          type: userTypes.LOGIN_SUCCESS,
          meta: {},
          error: null,
          payload: {
            user: userContent.user,
          }
        },
        {
          type: alertTypes.ALERT_SUCCESS,
          meta: {},
          error: null,
          payload: {
            id: uuidv4(),
            message: "Login Successfully"
          }

        }
      ];
      const store = mockStore({ token:'', user: null });

      return store.dispatch(login(credentials.email, credentials.password)).then(() => {
        // console.log(store.getActions());
        expectedActions.map((action, index) => {
          expect(store.getActions()[index].type).to.equal(action.type);
        });
      });
    });

    it('should login failed and alert failure when email and password is NOT match', () => {
      const credentials = {
        email: 'user0@ab.com',
        // Wrong password
        password: ''
      };

      const alertContent = {
        id: uuidv4(),
        message: 'Invalid email or password'
      };

      const expectedActions = [
        {
          type: userTypes.LOGIN_REQUEST,
          meta: {},
          error: null,
          payload: {}
        },
        {
          type: userTypes.LOGIN_FAILURE,
          meta: {},
          error: true,
          payload: {
            error: ['Error: Invalid email or password']
          }
        },
        {
          type: alertTypes.ALERT_FAILURE,
          meta: {},
          error: true,
          payload: {
            id: uuidv4(),
            message: 'Invalid email or password' || 'Unknown Error'
          }
        }
      ];
      const store = mockStore({ token:'', user: null });

      return store.dispatch(login(credentials.email, credentials.password))
        .then(() => {
          console.log(store.getActions()[2].type);
          expectedActions.map((action, index) => {
            expect(store.getActions()[index].type).to.equal(action.type);
          });
        }).catch(err => {
          // console.log(err.message);
          expect(err.message).to.be.a('string');
        });
    });
  });

  describe('Register', () => {
    beforeEach(() => {
      global.sessionStorage = jest.genMockFunction();
      global.sessionStorage.setItem = jest.genMockFunction();
      global.sessionStorage.getItem = jest.genMockFunction();
    })

    afterEach(() => {
      fetchMock.reset();
      fetchMock.restore();
    });

    it("should register successfully", () => {
      let randomNumber = Math.floor(Math.random() * 100000);
      let email = 'jinguanglong' + randomNumber + '@icloud.com';
      console.log(email);

      const credentials = {
        email: email,
        password: '1234567890',
        passwordConfirmation: '1234567890',
      };

      const alertContent = {
        id: uuidv4(),
        message: 'Register successfully'
      };

      const expectedActions = [
        {
          type: userTypes.REGISTER_REQUEST,
          meta: {},
          error: null,
          payload: {}
        },
        {
          type: userTypes.REGISTER_SUCCESS,
          meta: {},
          error: null,
          payload: {
            user: userContent.user,
          }
        },
        {
          type: alertTypes.ALERT_SUCCESS,
          meta: {},
          error: null,
          payload: {
            id: uuidv4(),
            message: alertContent.message
          }

        }
      ];
      const store = mockStore({ token:'', user: null });

      return store.dispatch(register(credentials)).then(() => {
        // console.log(store.getActions());
        expectedActions.map((action, index) => {
          expect(store.getActions()[index].type).to.equal(action.type);
        });
      });
    })
  })
});
