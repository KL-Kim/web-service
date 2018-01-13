import React, { Component } from 'react';
import { withRouter } from 'react-router-dom';
import { bindActionCreators } from 'redux';
import { connect } from 'react-redux';

import logo from '../../css/logo.svg';
import LoginForm from '../containers/LoginForm';
import * as UsersActions from '../actions/user.actions';

const style = {
  textAlign: 'center'
};

class Root extends Component {
  render() {
    return (
      <div style={style}>
        <header className="App-header">
          <img src={logo} className="App-logo" alt="logo" />
          <h1 className="App-title">Welcome to React</h1>
        </header>
        <LoginForm login={this.props.login}/>
        <p>
          Token is: {this.props.token}
        </p>
      </div>
    );
  }
}

const mapStateToProps = (state, ownProps) => {
  return {
    token: state.userReducer.token,
    isFetching: state.userReducer.isFetching,
    isLoggedIn: state.userReducer.isLoggedIn
  };
};

const mapDispatchToProps = (dispath) => {
  return bindActionCreators(UsersActions, dispath);
};

export default withRouter(connect(mapStateToProps, mapDispatchToProps)(Root));
