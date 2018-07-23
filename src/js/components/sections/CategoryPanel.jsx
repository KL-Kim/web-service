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
import BusinessCard from 'js/components/utils/BusinessCard';

// Actions
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
          list: response.list.slice(),
        });
      }
    });
  }

  componentWillUnmount() {
    this.props.clearBusinessList();
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

        <Grid container spacing={24} justify="center">
        {
          this.state.list.map(item => (
            <Grid item lg={4} key={item._id}>
              <BusinessCard
                bid={item._id}
                title={item.krName}
                enName={item.enName}
                rating={item.ratingAverage}
                thumbnailUri={item.thumbnailUri}
                category={item.category}
                tags={item.tags}
                event={item.event}
                myFavors={this.state.myFavors}
              />
            </Grid>
          ))
        }
        </Grid>
      </div>
    );
  }
}

CategoryPanel.propTypes = {
  "classes": PropTypes.object.isRequired,
  "category": PropTypes.object.isRequired,
  "isFetching": PropTypes.bool,
}

const mapStateToProps = (state, ownProps) => {
  return {
    "isFetching": state.businessReducer.isFetching,
  };
};

export default connect(mapStateToProps, { getBusinessList, clearBusinessList })(withStyles(styles)(CategoryPanel));
