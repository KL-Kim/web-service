import React, { Component } from 'react';
import PropTypes from 'prop-types';
import Carousel from 'react-slick';
import Img from 'react-image';

// Carousel CSS Stylesheet
import "css/slick.css";

import config from 'js/config/config.js';

// Material UI Components
import { withStyles } from '@material-ui/core/styles';

// Custom Components
import Skeleton from 'js/components/utils/Skeleton';

const styles = theme => ({
  image: {
    width: '100%',
    height: '100%',
    minHeight: 150,
    objectFit: 'cover',
  },
  skeleton: {
    backgroundColor: '#aaa',
    width: 1450,
    height: 750,
    animation: 'fadeIn 0.5s Infinite alternate',
    boxShadow: "0 5px 15px -8px rgba(0, 0, 0, 0.24), 0 8px 10px -5px rgba(0, 0, 0, 0.2)",
}
});

class SectionCarousel extends Component {
  render() {
    const { classes } = this.props;

    const sliderSettings = {
      dots: true,
      infinite: true,
      speed: 500,
      slidesToShow: 1,
      slidesToScroll: 1,
      autoplay: true,
      arrows: false,
      draggable: true,
      fade: false,
      pauseOnHover: false,
      accessibility: false,
    };

    return (
      <Carousel {...sliderSettings}>
        <div>
          <Img 
            src={config.DEFAULT_HOMEPAGE_IMAGES_URL + 'Homepage_Carousel_1.jpg'}
            alt="image1" 
            className={classes.image}
            loader={<Skeleton />}
          />
          <div className="slick-caption">
            <h4>
              Somewhere Beyond, United States
            </h4>
          </div>
        </div>
        <div>
          <Img 
            src={config.DEFAULT_HOMEPAGE_IMAGES_URL + 'Homepage_Carousel_2.jpg'} 
            alt="image2" 
            className={classes.image} 
            loader={<Skeleton />}
          />
          <div className="slick-caption">
            <h4>
              Yellowstone National Park, United States
            </h4>
          </div>
        </div>
      </Carousel>
    );
  }
}

SectionCarousel.propTypes = {
  "classes": PropTypes.object.isRequired,
}

export default withStyles(styles)(SectionCarousel);
