import React from 'react';
import { configure, shallow, mount, render } from 'enzyme';
import Adapter from 'enzyme-adapter-react-16';
import { expect } from 'chai';
import { MemoryRouter } from 'react-router-dom';
import createRouterContext from 'react-router-test-context';
// import { createShallow } from 'material-ui/test-utils';

import Typography from 'material-ui/Typography';
import Button from 'material-ui/Button';

import configureStore from '../js/stores/user.store';
import Foo from './Foo';
import SignupPageConnected, { SignupPage } from '../js/components/SignupPage';

configure({ adapter: new Adapter() });

const setup = () => {
  const context = createRouterContext();
  const store = configureStore();

  const props = {
    isLoggedIn: false,
    classes: {
      button: {
        marginTop: 8 * 4,
      }
    },
    history: context.router.history,
  };
  // const props = {
  //   buttonName: "Click"
  // };

  // const materialShallow = createShallow({
  //   dive: false
  // });

  // const wrapper = materialShallow(<Foo {...props} />);
  const wrapper = shallow(
      <SignupPage {...props}/>
  );
  // const wrapperConnected = shallow(
  //   <MemoryRouter initialEntries={['/']} initialIndex={0}>
  //     <LoginFormConnected store={store} />
  //   </MemoryRouter>
  // );
  const wrapperConnected = shallow(
    <SignupPageConnected store={store} history={context.router.history} />
  );

  return {
    wrapper,
    wrapperConnected,
    props
  };
}
