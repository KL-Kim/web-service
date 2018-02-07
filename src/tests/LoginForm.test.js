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
import LoginFormConnected, { LoginForm } from '../js/components/containers/LoginForm';

configure({ adapter: new Adapter() });

const setup = () => {
  const context = createRouterContext();
  const store = configureStore();

  const props = {
    isLoggedIn: false,
    login: jest.fn(),
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
      <LoginForm {...props}/>
  );
  // const wrapperConnected = shallow(
  //   <MemoryRouter initialEntries={['/']} initialIndex={0}>
  //     <LoginFormConnected store={store} />
  //   </MemoryRouter>
  // );
  const wrapperConnected = shallow(
    <LoginFormConnected store={store} history={context.router.history} />
  );

  return {
    wrapper,
    wrapperConnected,
    props
  };
}

describe('<LoginForm />', () => {

  it('Should render without throwing an Error', () => {
    const { wrapper } = setup();
    // console.log(wrapper.props());
    expect(wrapper.contains(<Typography type="display1" align="center">Sign In</Typography>)).to.be.true;
  });

  it('Shoud have history props', () => {
    const { wrapperConnected } = setup();
    // console.log(wrapper.props());
    expect(wrapperConnected.props().history).to.be.an('object');
  });

  describe("Testing email input tag", () => {
    it('Should show error on blur when input an invalid email ', () => {
      const { wrapper } = setup();
      const input = wrapper.find('#email');
      input.simulate('change', {
        target: {
          name: 'email',
          value: ' '
        }
      });

      input.simulate('blur');
      const button = wrapper.find(Button);
      const instance = wrapper.instance();

      expect(wrapper.state().email.showError).to.be.true;
      expect(button.props().disabled).to.be.true;
      expect(instance.isValidEmail()).to.be.false;
    });

    it('Should show error on pressing enter button when input an invalid email', () => {
      const { wrapper } = setup();
      const input = wrapper.find('#email');
      input.simulate('change', {
        target: {
          name: 'email',
          value: 'user'
        }
      });

      const form = wrapper.find('form');
      form.simulate('submit', {
        preventDefault: jest.fn()
      });

      const button = wrapper.find(Button);
      const instance = wrapper.instance();
      // console.log(wrapper.state().email);
      expect(wrapper.state().email.showError).to.be.true;
      expect(button.props().disabled).to.be.true;
      expect(instance.isValidEmail()).to.be.false;
    });

    it('Should not show error on blur when input a valid email', () => {
      const { wrapper } = setup();
      const input = wrapper.find('#email');
      input.simulate('change', {
        target: {
          name: 'email',
          value: 'user0@abc.com'
        }
      });

      input.simulate('blur');

      const instance = wrapper.instance();

      expect(wrapper.state().email.showError).to.be.false;
      expect(instance.isValidEmail()).to.be.true;
    });

    it('Should not show error on pressing enter button when input a valid email', () => {
      const { wrapper } = setup();
      const input = wrapper.find('#email');
      input.simulate('change', {
        target: {
          name: 'email',
          value: 'user0@abc.com'
        }
      });

      const form = wrapper.find('form');
      form.simulate('submit', {
        preventDefault: jest.fn()
      });

      const instance = wrapper.instance();

      expect(wrapper.state().email.showError).to.be.false;
      expect(instance.isValidEmail()).to.be.true;
    });
  });

  describe("Testing password input tag", () => {
    it('Should show error on blur when the password is shorter than 8', () => {
      const { wrapper } = setup();
      const input = wrapper.find('#password');
      input.simulate('change', {
        target: {
          name: 'password',
          value: '1234567'
        }
      });

      input.simulate('blur');

      const instance = wrapper.instance();
      const button = wrapper.find(Button);

      expect(wrapper.state().password.showError).to.be.true;
      expect(button.props().disabled).to.be.true;
      expect(instance.isValidPassword()).to.be.false;

    });

    it('Should not show error on blur when input a valid password', () => {
      const { wrapper } = setup();
      const input = wrapper.find('#password');
      input.simulate('change', {
        target: {
          name: 'password',
          value: '12345678'
        }
      });

      input.simulate('blur');

      const instance = wrapper.instance();

      expect(wrapper.state().password.showError).to.be.false;
      expect(instance.isValidPassword()).to.be.true;
    });

    it('Should show error on pressing enter button when input an invalid password', () => {
      const { wrapper } = setup();
      const inputEmail = wrapper.find('#email');
      inputEmail.simulate('change', {
        target: {
          name: 'email',
          value: 'user0@abc.com'
        }
      });
      const inputPassword = wrapper.find('#password');
      inputPassword.simulate('change', {
        target: {
          name: 'password',
          value: '1234567'
        }
      });

      const form = wrapper.find('form');
      form.simulate('submit', {
        preventDefault: jest.fn()
      });

      const instance = wrapper.instance();
      const button = wrapper.find(Button);

      // console.log(wrapper.state());
      // On submit event, first check email validity, then check password validity.
      expect(wrapper.state().email.showError).to.be.false;
      expect(wrapper.state().password.showError).to.be.true;
      expect(button.props().disabled).to.be.true;
      expect(instance.isValidPassword()).to.be.false;

    });

    it('Should submit successfully on pressing enter button only when input a valid email and a valid password', () => {
      const { wrapper } = setup();
      const inputEmail = wrapper.find('#email');
      inputEmail.simulate('change', {
        target: {
          name: 'email',
          value: 'user0@abc.com'
        }
      });
      const inputPassword = wrapper.find('#password');
      inputPassword.simulate('change', {
        target: {
          name: 'password',
          value: '12345678'
        }
      });

      const form = wrapper.find('form');
      form.simulate('submit', {
        preventDefault: jest.fn()
      });

      const instance = wrapper.instance();

      // console.log(wrapper.state());
      expect(wrapper.state().email.showError).to.be.false;
      expect(wrapper.state().password.showError).to.be.false;
      expect(instance.isValidEmail() && instance.isValidPassword()).to.be.true;
    });

  });

});
