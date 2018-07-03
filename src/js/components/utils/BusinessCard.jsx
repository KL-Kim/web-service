import React, { Component } from 'react';
import PropTypes from 'prop-types';
import { connect } from 'react-redux';
import { Link } from 'react-router-dom';
import _ from 'lodash';
import Stars from 'react-stars';

// Material UI Components
import { withStyles } from '@material-ui/core/styles';
import Grid from '@material-ui/core/Grid';
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

// Custom Components
import Badge from './Badge';

// Actions
import { favorOperation } from 'js/actions/user.actions';
import { openLoginDialog } from 'js/actions/app.actions';

import config from 'js/config/config';

// Default Image
import image from 'css/ikt-icon.gif';

const styles = (theme) => ({
  "card": {
    fontFamily: 'sans-serif',
    marginBottom: theme.spacing.unit * 3,
  },
  "media": {
    height: 180,
  },
  "chip": {
    marginRight: theme.spacing.unit,
  },
});

class BusinessCard extends Component {
  constructor(props) {
    super(props);

    this.state = {
      isFavor: false,
    };

    if (props.myFavors) {
      const index = props.myFavors.indexOf(props.bid);
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

    return (
      <div>
        <Card className={classes.card}>
          <Link to={"/business/s/" + this.props.enName}>
            <CardMedia className={classes.media}
              image={_.isEmpty(thumbnailUri) ? image : (config.API_GATEWAY_ROOT + '/' + thumbnailUri.hd)}
              title={this.props.title}
            />

            <CardContent>
              <Grid container justify="space-between" alignItems="center">
                <Grid item>
                  <Grid container spacing={8} alignItems="center">
                    <Grid item>
                      <Typography variant="title">{this.props.title}</Typography>
                    </Grid>
                    <Grid item>
                      {
                        this.props.event
                          ? <Badge color="rose">이벤트</Badge>
                          : ''
                      }
                    </Grid>
                  </Grid>
                </Grid>

                <Grid item>
                  <Typography variant="subheading">{this.props.category.krName}</Typography>
                </Grid>
              </Grid>

              <Stars count={5} size={20} value={this.props.rating} edit={false} />
            </CardContent>
          </Link>

          <CardActions>
            <Grid container justify="space-between" alignItems="center">
              <Grid item>
                {
                  this.props.tags.map(item => (
                    <Link to={"/business/tag/" +item.enName} key={item._id} className={classes.chip}>
                      <Badge
                        color="info"
                      >
                        {item.krName}
                      </Badge>
                    </Link>
                  ))
                }
              </Grid>
              <Grid item>
                <Tooltip id="favor-icon" title="Add to Favor">
                  <IconButton color={this.state.isFavor ? "secondary" : 'default'} onClick={this.hanldeAddToFavor}>
                    {
                      this.state.isFavor ? <Favorite /> : <FavoriteBorder />
                    }
                  </IconButton>
                </Tooltip>
              </Grid>
            </Grid>
          </CardActions>
        </Card>
      </div>
    );
  }
}

BusinessCard.defaultProps = {
  thumbnail: {},
  category: {},
  tags: [],
  myFavors: [],
};

BusinessCard.propTypes = {
  "classes": PropTypes.object.isRequired,
  "bid": PropTypes.string.isRequired,
  "enName": PropTypes.string.isRequired,
  "rating": PropTypes.number,
  "thumbnail": PropTypes.object,
  "myFavors": PropTypes.array,
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
