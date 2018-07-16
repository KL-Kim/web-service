import React, { Component } from 'react';
import PropTypes from 'prop-types';
import Carousel from 'react-slick';
import Img from 'react-image';

import "css/slick.css";

// Material UI Components
import { withStyles } from '@material-ui/core/styles';

// Images
import image2 from 'img/background_2.jpg';
import image3 from 'img/background_3.jpg';


const styles = theme => ({
  image: {
    width: '100%',
    height: 600,
    objectFit: 'cover',
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
      fade: true,
      pauseOnHover: false,
      accessibility: false,
    };

    return (
      <Carousel {...sliderSettings}>
        <div>
          <Img src={image2} alt="image2" className={classes.image} />
          <div className="slick-caption">
            <h4>
              Somewhere Beyond, United States
            </h4>
          </div>
        </div>
        <div>
          <Img src={image3} alt="image3" className={classes.image} />
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
