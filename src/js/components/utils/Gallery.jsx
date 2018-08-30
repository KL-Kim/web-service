import React, { Component } from 'react';
import PropTypes from 'prop-types';
import _ from 'lodash';

// Material UI Components
import { withStyles } from '@material-ui/core/styles';
import Typography from '@material-ui/core/Typography';
import GridList from '@material-ui/core/GridList';
import GridListTile from '@material-ui/core/GridListTile';

// Custom Component
import LightBox from 'js/components/utils/LightBox';

const styles = theme => ({
    root: {
        display: 'flex',
        flexWrap: 'wrap',
        justifyContent: 'space-around',
        overflow: 'hidden',
    },
    gridList: {
        width: '100%',
        height: 'auto',
        // Promote the list into his own layer on Chrome. This cost memory but helps keeping high FPS.
    },
    image: {
        height: '100%',
        cursor: 'zoom-in',
        objectFit: 'cover',
    }
});

class Gallery extends Component {
    constructor(props) {
        super(props);

        this.state = {
            currentImage: 0,
            isLightboxOpen: false,
            gallery: [],
        };

        this.handleSelectImage = this.handleSelectImage.bind(this);
        this.handleLightboxClose = this.handleLightboxClose.bind(this);
    }

    componentDidMount() {
        if (!_.isEmpty(this.props.gallery)) {
            const gallery = [];

            this.props.gallery.map(image => {
                gallery.push({
                    src: image.url + '-business',
                    alt: image.name
                });
            })

            this.setState({
                gallery: [...gallery],
            });
        }
    }

    handleSelectImage = index => e => {
        this.setState({
            currentImage: index,
            isLightboxOpen: true,
        });
    }

    handleLightboxClose() {
        this.setState({
            isLightboxOpen: false
        });
    }

    render() {
        const { classes, gallery } = this.props;

        return _.isEmpty(gallery) ? null : (
            <div className={classes.root}>
                <GridList cols={2} cellHeight={150} spacing={1} className={classes.gridList}>
                    {
                        gallery.map((image, index) => (
                            <GridListTile key={image._id} cols={1}>
                                <img 
                                    className={classes.image}
                                    src={image.url + '-thumbnail'} 
                                    alt={image._id}  
                                    onClick={this.handleSelectImage(index)}
                                />
                            </GridListTile>
                        ))
                    }
                </GridList>

                <LightBox
                    open={this.state.isLightboxOpen}
                    images={this.state.gallery}
                    currentImage={this.state.currentImage}
                    onClose={this.handleLightboxClose}
                />
            </div>
        );
    }
}

Gallery.propTypes = {
    "classes": PropTypes.object.isRequired,
    "gallery": PropTypes.array.isRequired,
};

export default withStyles(styles)(Gallery);