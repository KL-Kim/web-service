import React, { Component } from 'react';
import PropTypes from 'prop-types';
import { connect } from 'react-redux';
import { Link } from 'react-router-dom';
import _ from 'lodash';
import Stars from 'react-stars';

// Material UI Components
import { withStyles } from '@material-ui/core/styles';
import Typography from '@material-ui/core/Typography';
import Tooltip from '@material-ui/core/Tooltip';
import IconButton from '@material-ui/core/IconButton';
import Card from '@material-ui/core/Card';
import CardActions from '@material-ui/core/CardActions';
import CardContent from '@material-ui/core/CardContent';
import CardMedia from '@material-ui/core/CardMedia';
import Chip from '@material-ui/core/Chip';

// Material UI Icons
import Share from '@material-ui/icons/Share';
import FavoriteBorder from '@material-ui/icons/FavoriteBorder';
import Favorite from '@material-ui/icons/Favorite';

import { favorOperation } from '../../actions/user.actions';
import { openLoginDialog } from '../../actions/app.actions';

import config from '../../config/config';
import image from '../../../css/ikt-icon.gif';

const styles = (theme) => ({
  card: {
    marginBottom: theme.spacing.unit * 3,
  },
  media: {
    height: 200,
  },
  chip: {
    marginRight: theme.spacing.unit,
  }
});

class BusinessCard extends Component {
  constructor(props) {
    super(props);

    this.state = {
      isFavor: false,
    };

    if (props.myFavors) {
      const index = props.myFavors.indexOf(props._id);
      if (index > -1) {
        this.state.isFavor = true;
      }
    }

    this.hanldeAddToFavor = this.hanldeAddToFavor.bind(this);
  }

  hanldeAddToFavor() {
    if (!this.props.isLoggedIn) {
      this.props.openLoginDialog();

      return ;
    }

    if (!_.isEmpty(this.props.user) && !_.isEmpty(this.props.bid)) {
      this.props.favorOperation(this.props.user._id, this.props.bid)
        .then(response => {
          if (response) {
            this.setState({
              isFavor: !this.state.isFavor
            });
          }
        });
    }
  }

  render() {
    const { classes, thumbnailUri } = this.props;
    const thumbnail = _.isEmpty(thumbnailUri) ? image : config.API_GATEWAY_ROOT + '/' + thumbnailUri.hd;

    return (
      <div>
        <Card className={classes.card}>
          <Link to={{
            "pathname": "/business/s/" + this.props.enName,
          }}>
            <CardMedia className={classes.media}
              image={thumbnail}
              title={this.props.title}
            />
            <CardContent>
              <Typography variant="title" gutterBottom>{this.props.title}</Typography>
              <Stars count={5} size={20} value={this.props.rating} edit={false} />
              <Typography variant="subheading" gutterBottom>{this.props.category.krName}</Typography>
              {
                _.isEmpty(this.props.tags)
                  ? ''
                  : this.props.tags.map(item => (
                    <Chip
                      key={item._id}
                      className={classes.chip}
                      label={item.krName}
                      />
                  ))
              }
            </CardContent>
          </Link>
          <CardActions>
            <Tooltip id="favor-icon" title="Add to Favor">
              <IconButton color={this.state.isFavor ? "secondary" : 'default'} onClick={this.hanldeAddToFavor}>
                {
                  this.state.isFavor ? <Favorite /> : <FavoriteBorder />
                }
              </IconButton>
            </Tooltip>
          </CardActions>
        </Card>
      </div>
    );
  }
}

BusinessCard.propTypes = {
  "classes": PropTypes.object.isRequired,
  "bid": PropTypes.string.isRequired,
  "enName": PropTypes.string.isRequired,
  "rating": PropTypes.number,
  "thumbnail": PropTypes.object,
  "myFavors": PropTypes.bool,
  "category": PropTypes.object.isRequired,
  "tags": PropTypes.array,
};

const mapStateToProps = (state, ownProps) => {
  return {
    "user": state.userReducer.user,
    "isLoggedIn": state.userReducer.isLoggedIn,
  };
};

export default connect(mapStateToProps, { favorOperation, openLoginDialog })(withStyles(styles)(BusinessCard));
