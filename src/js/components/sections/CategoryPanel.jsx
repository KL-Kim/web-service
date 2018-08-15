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
import { favorOperation } from 'js/actions/user.actions';
import { getBusinessList, clearBusinessList } from 'js/actions/business.actions.js';

const styles = theme => ({

});

class CategoryPanel extends PureComponent {
  constructor(props) {
    super(props);

    this.state = {
      list: [],
    };
  }

  componentDidMount() {
    this.props.getBusinessList({
      limit: 3,
      category: this.props.category.enName,
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
            <Typography variant="title" gutterBottom>#{this.props.category.krName}</Typography>
          </Grid>

          <Grid item>
            <Link to={"/business/category/" + this.props.category.enName}>
              <Button>More</Button>
            </Link>
          </Grid>
        </Grid>

        <BusinessPanel />
      </div>
    );
  }
}

CategoryPanel.propTypes = {
  "classes": PropTypes.object.isRequired,
  "category": PropTypes.object.isRequired,
  "isFetching": PropTypes.bool,
  "user": PropTypes.object,
  "isLoggedIn": PropTypes.bool.isRequired,

  // Methods
  "getBusinessList": PropTypes.func.isRequired,
  "favorOperation": PropTypes.func.isRequired,
}

const mapStateToProps = (state, ownProps) => {
  return {
    "user": state.userReducer.user,
    "isLoggedIn": state.userReducer.isLoggedIn,
    "isFetching": state.businessReducer.isFetching,
  };
};

export default connect(mapStateToProps, { 
  getBusinessList, 
  favorOperation, 
  clearBusinessList,
})(withStyles(styles)(CategoryPanel));
