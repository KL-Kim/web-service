import React from 'react';
import { configure,
  // shallow,
  mount,
  render } from 'enzyme';
import { createShallow } from 'material-ui/test-utils';
import Adapter from 'enzyme-adapter-react-16';
// import { expect } from 'chai';
import { MemoryRouter } from 'react-router-dom';
import { Provider } from 'react-redux';
import configureStore from '../js/stores/user.store';

import SigninPage from '../js/components/SigninPage';
import LoginFormConnected, { LoginForm } from '../js/components/containers/LoginForm';

import Typography from 'material-ui/Typography';
import Button from 'material-ui/Button';

const store = configureStore();

configure({ adapter: new Adapter() });

describe('Web service sign in spec', () => {
  let wrapper;
  let shallow;

  beforeEach(() => {
    shallow = createShallow({
      dive: true
    });
    wrapper = shallow(
      <MemoryRouter>
        <LoginFormConnected />
      </MemoryRouter>
    );
  });

  it('Should render without throwing an Error', () => {
    // const button = wrapper.find('Button');

    expect(wrapper.contains(<Typography type="display1" align="center">Sign In</Typography>)).toBe(true);
  });
});
