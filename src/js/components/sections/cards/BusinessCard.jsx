import React, { PureComponent } from 'react';
import PropTypes from 'prop-types';
import { Link } from 'react-router-dom';
import _ from 'lodash';
import Stars from 'react-stars';
import Img from 'react-image';

// Material UI Components
import { withStyles } from '@material-ui/core/styles';
import Grid from '@material-ui/core/Grid';
import Typography from '@material-ui/core/Typography';
import Tooltip from '@material-ui/core/Tooltip';
import IconButton from '@material-ui/core/IconButton';
import Card from '@material-ui/core/Card';
import CardActions from '@material-ui/core/CardActions';
import CardContent from '@material-ui/core/CardContent';
import Chip from '@material-ui/core/Chip';

// Material UI Icons
import Share from '@material-ui/icons/Share';
import FavoriteBorder from '@material-ui/icons/FavoriteBorder';
import Favorite from '@material-ui/icons/Favorite';

// Custom Components
import Skeleton from 'js/components/utils/Skeleton';
import Badge from 'js/components/utils/Badge';

// Default Image
import config from 'js/config/config.js';

const styles = (theme) => ({
  "root": {
    fontFamily: 'sans-serif', 
    maxWidth: 400,
    minWidth: 220,
  },
  "content": {
    paddingBottom: '0px !important',
  },
  "image": {
    width: '100%', 
    height: 180, 
    objectFit: 'cover',
    position: 'relative',
  }
});

class BusinessCard extends PureComponent {
  constructor(props) {
    super(props);

    this.state = {
      isFavor: props.isFavor,
    };

    this.handleToggleFavor = this.handleToggleFavor.bind(this);
  }

  componentDidUpdate(prevProps) {
    if (prevProps.isFavor !== this.props.isFavor) {
      this.setState({
        isFavor: this.props.isFavor,
      });
    }
  }

  handleToggleFavor() {
    if (!this.props.isLoggedIn) {
      this.props.openLoginDialog();
      return ;
    }

    if (this.props.favorOperation && this.props.userId && this.props.bid) {
      this.props.favorOperation(this.props.userId, this.props.bid)
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
    const { classes } = this.props;

    return (
      <div>
        <Card className={classes.root}>
          <Link to={"/business/s/" + this.props.slug}>
            <Img 
              className={classes.image}
              src={_.isEmpty(this.props.image) ? config.DEFAULTL_CARD_IMAGE_URL : this.props.image + '-thumbnail'}
              loader={<Skeleton />}
            />
          </Link>

            <CardContent className={classes.content}>
              <Grid container justify="space-between" alignItems="center">
                <Grid item>
                  <Grid container alignItems="center">
                    <Grid item>
                      <Typography variant="headline" component="h3">{this.props.title}</Typography>
                    </Grid>

                    
                  </Grid>
                </Grid>

                <Grid item>
                  <Typography variant="subheading">{this.props.category.krName}</Typography>
                </Grid>
              </Grid>

              <Stars count={5} size={20} value={this.props.rating} edit={false} />
            </CardContent>
          

          <CardActions>
            <Grid container justify="space-between" alignItems="center">
              <Grid item>
                <div>
                  <Grid container spacing={8}>
                    {
                      this.props.event && <Grid item><Badge color="rose">이벤트</Badge></Grid>
                    }
                    {
                      _.isEmpty(this.props.tags)
                        ? null
                        : this.props.tags.map(item => (
                            <Grid item key={item._id} >
                              <Link to={"/business/tag/" +item.slug} className={classes.chip}>
                                <Badge color="info">
                                  #{item.krName}
                                </Badge>
                              </Link>
                            </Grid>
                        ))
                    }
                  </Grid>
                </div>
              </Grid>
              
              <Grid item>
                <Tooltip id="favor-icon" title="Add to Favor">
                  <IconButton color={this.state.isFavor ? "secondary" : 'default'} onClick={this.handleToggleFavor}>
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
  "thumbnail": {},
  "category": {},
  "tags": [],
  "myFavors": [],
  "isLoggedIn": false,
  "userId": '',
};

BusinessCard.propTypes = {
  "classes": PropTypes.object.isRequired,
  "bid": PropTypes.string.isRequired,
  "title": PropTypes.string.isRequired,
  "slug": PropTypes.string.isRequired,
  "rating": PropTypes.number.isRequired,
  "image": PropTypes.string,
  "category": PropTypes.object.isRequired,
  "tags": PropTypes.array,
  "isLoggedIn": PropTypes.bool.isRequired,
  "userId": PropTypes.string.isRequired,
  "isFavor": PropTypes.bool.isRequired,

  // Methods
  "favorOperation": PropTypes.func.isRequired,
  "openLoginDialog": PropTypes.func.isRequired,
};

export default withStyles(styles)(BusinessCard);
