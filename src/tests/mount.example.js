import React from 'react';
import { configure, shallow, mount, render } from 'enzyme';
import Adapter from 'enzyme-adapter-react-16';
import { expect } from 'chai';
import { MemoryRouter } from 'react-router-dom';
import configureStore from '../js/stores/user.store';
import createRouterContext from 'react-router-test-context';

import LoginFormConnected, { LoginForm } from '../js/components/containers/LoginForm';

configure({ adapter: new Adapter() });

const setup = () => {
  const store = configureStore();
  const context = createRouterContext();

  const props = {
    store: store,
    history: context.router.history,
  }

  const wrapper = mount(
    <MemoryRouter initialEntries={['/']} initialIndex={0}>
      <LoginFormConnected {...props} />
    </MemoryRouter>
  );

  return {
    wrapper
  };
}

describe('Testing with mount ', () => {
  it('Should have props history object', () => {
    const { wrapper } = setup();
    // console.log(wrapper.props().children.props.history);
    expect(wrapper.props().children.props.history).to.be.an('object');
  });

  it('Should check email on input blur event', () => {
    const { wrapper } = setup();
    const input = wrapper.find('input');
    // console.log(input);
    expect(input).have.length(2);
  });
});
