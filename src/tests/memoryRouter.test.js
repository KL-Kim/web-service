import React from 'react';
import { configure,
  shallow,
  mount,
  render } from 'enzyme';
import Adapter from 'enzyme-adapter-react-16';
import { expect } from 'chai';
import { MemoryRouter } from 'react-router-dom';
import createRouterContext from 'react-router-test-context';
import configureStore from '../js/stores/user.store';

import LoginForm from '../js/components/containers/LoginForm';

configure({ adapter: new Adapter() });
const store = configureStore();

describe('Testing with MemoryRouter', () => {
  let wrapper;

  beforeEach(() => {
    const context = createRouterContext();
    wrapper = shallow(

        <LoginForm store={store}/>

    );
  });

  it('Should render without throwing an Error', () => {
    console.log(wrapper.props());
    expect(wrapper.props().history).to.be.an('object');
  });
});
