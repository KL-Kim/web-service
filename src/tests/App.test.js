import React from 'react';
import { configure,
  // shallow,
  mount,
  render } from 'enzyme';
import { createShallow } from 'material-ui/test-utils';
import Adapter from 'enzyme-adapter-react-16';
import { expect } from 'chai';

import Grid from 'material-ui/Grid';
import Typography from 'material-ui/Typography';
import Button from 'material-ui/Button';
import Toolbar from 'material-ui/Toolbar';

import Foo from './Foo';
import App from '../js/components/404';

configure({ adapter: new Adapter() });

describe('Web service', () => {
  let wrapper;
  let shallow;

  beforeEach(() => {
    shallow = createShallow({
      dive: true
    });
    wrapper = shallow(<App />);
  });

  it('Should render without throwing an Error', () => {
    // console.log(wrapper);
    expect(wrapper.contains(<Typography type="display3" align="center">404 Not found</Typography>)).to.equal(true);
  });
});
