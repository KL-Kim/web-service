import React, { PureComponent } from 'react';
import PropTypes from 'prop-types';
import { connect } from 'react-redux';
import { Link } from 'react-router-dom';
import _ from 'lodash';

// Material UI Components
import { withStyles } from '@material-ui/core/styles';
import Grid from '@material-ui/core/Grid';
import Typography from '@material-ui/core/Typography';
import Button from '@material-ui/core/Button';

// Custom Components
import BusinessPanel from './BusinessPanel';

// Actions
import { openLoginDialog } from 'js/actions/app.actions';
import { favorOperation } from 'js/actions/user.actions';
import { getBusinessList, clearBusinessList } from 'js/actions/business.actions.js';

const styles = theme => ({

});

class TagPanel extends PureComponent {
  constructor(props) {
    super(props);

    this.state = {
      list: [],
    };
  }

  componentDidMount() {
    this.props.getBusinessList({
      limit: 3,
      tag: this.props.tag.enName,
    }).then(response => {
      if (response) {
        this.setState({
          list: [...response.list],
        });
      }
    });
  }

  render() {
    const { classes } = this.props;

    return _.isEmpty(this.state.list) ? null : (
      <div>
        <Grid container justify="space-between" alignItems="flex-end">
          <Grid item>
            <Typography variant="title" gutterBottom>#{this.props.tag.krName}</Typography>
          </Grid>

          <Grid item>
            <Link to={"/business/tag/" + this.props.tag.enName}>
              <Button>More</Button>
            </Link>
          </Grid>
        </Grid>

        <BusinessPanel
          businessList={this.state.list}
          isLoggedIn={this.props.isLoggedIn}
          userId={_.isEmpty(this.props.user) ? '' : this.props.user._id}
          favorOperation={this.props.favorOperation}
          openLoginDialog={this.props.openLoginDialog}
          clearBusinessList={this.props.clearBusinessList}
        />
      </div>
    );
  }
}

TagPanel.propTypes = {
  "classes": PropTypes.object.isRequired,
  "tag": PropTypes.object.isRequired,
  "isFetching": PropTypes.bool,
  "user": PropTypes.object,
  "isLoggedIn": PropTypes.bool.isRequired,

  // Methods
  "getBusinessList": PropTypes.func.isRequired,
  "openLoginDialog": PropTypes.func.isRequired,
  "favorOperation": PropTypes.func.isRequired,
};

const mapStateToProps = (state, ownProps) => {
  return {
    "user": state.userReducer.user,
    "isLoggedIn": state.userReducer.isLoggedIn,
    "isFetching": state.businessReducer.isFetching,
  };
};

export default connect(mapStateToProps, { 
  getBusinessList, 
  openLoginDialog,
  favorOperation, 
  clearBusinessList,
})(withStyles(styles)(TagPanel));
