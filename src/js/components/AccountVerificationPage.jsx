import React, { Component } from 'react';
import PropTypes from 'prop-types';
import { Link } from 'react-router-dom';
import { connect } from 'react-redux';

// Material UI Components
import { withStyles } from '@material-ui/core/styles';
import Typography from '@material-ui/core/Typography';
import Paper from '@material-ui/core/Paper';
import Button from '@material-ui/core/Button';

// Custom Components
import Container from './layout/Container';
import LoadingProgress from 'js/components/utils/LoadingProgress';

// Actions
import { verifyAccount } from 'js/actions/user.actions.js';

// Common Style
import { root } from 'assets/jss/common.style';

const styles = theme => ({
  root: root(theme),
  paper: {
    marginTop: theme.spacing.unit * 5,
    paddingTop: theme.spacing.unit * 5,
    paddingBottom: theme.spacing.unit * 5,
    paddingLeft: theme.spacing.unit * 10,
    paddingRight: theme.spacing.unit * 10,
    marginBottom: theme.spacing.unit,
    textAlign: 'center',
  },
  paragraph: {
    marginTop: theme.spacing.unit * 5,
    marginBottom: theme.spacing.unit * 5,
  }
});

class AccountVerificationPage extends Component {
  constructor(props) {
    super(props);

    this.state = {
      "message": "Loading...",
    };
  }

  componentDidMount() {
    this.props.verifyAccount(this.props.match.params.token)
      .then(response => {
        if (response) {
          this.setState({
            "message": "Your account has been verified successfully."
          });
        } else {
          this.setState({
            "message": "Verification failed, Please sign in and verify your account."
          });
        }
      });
  }


  render() {
    const { classes } = this.props;

    return (
      <Container>
        <div className={classes.root}>
          <Typography variant="display1" align="center" gutterBottom>Account Verification</Typography>

          <Paper className={classes.paper}>
            <div className={classes.paragraph}>
              {
                this.props.isFetching
                  ? <LoadingProgress isLoading={this.props.isFetching} />
                  : <Typography variant="body2" align="center" className={classes.paragraph}>
                      {this.state.message}
                    </Typography>
              }
            </div>

            <div>
              <Link to="/">
                <Button color="primary">
                  Home
                </Button>
              </Link>
            </div>
          </Paper>
        </div>
      </Container>
    );
  }
}

AccountVerificationPage.propTypes = {
  classes: PropTypes.object.isRequired,
  match: PropTypes.object.isRequired,
}

const mapStateToProps = (state, ownProps) => {
  return {
    isFetching: state.userReducer.isFetching,
    user: state.userReducer.user,
    verifyError: state.userReducer.error,
  };
};

export default connect(mapStateToProps, { verifyAccount })(withStyles(styles)(AccountVerificationPage));
