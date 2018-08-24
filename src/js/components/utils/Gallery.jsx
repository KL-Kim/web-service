import React, { Component } from 'react';
import PropTypes from 'prop-types';
import _ from 'lodash';
import Lightbox from 'react-images';

// Material UI Components
import { withStyles } from '@material-ui/core/styles';
import Typography from '@material-ui/core/Typography';
import GridList from '@material-ui/core/GridList';
import GridListTile from '@material-ui/core/GridListTile';

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

        this.gotoPrevLightboxImage = this.gotoPrevLightboxImage.bind(this);
        this.gotoNextLightboxImage = this.gotoNextLightboxImage.bind(this);
        this.handleSelectImage = this.handleSelectImage.bind(this);
        this.handleCloseLightbox = this.handleCloseLightbox.bind(this);
        this.gotoImage = this.gotoImage.bind(this);
    }

    componentDidMount() {
        const gallery = [];

        if (!_.isEmpty(this.props.gallery)) {
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

    gotoPrevLightboxImage() {
        this.setState({
            currentImage: this.state.currentImage - 1,
        });
    }

    gotoNextLightboxImage() {
        this.setState({
            currentImage: this.state.currentImage + 1,
        });
    }

    gotoImage(index) {
        this.setState({
            currentImage: index
        });
    }

    handleSelectImage = index => e => {
        this.setState({
            currentImage: index,
            isLightboxOpen: true,
        });
    }

    handleCloseLightbox() {
        this.setState({
            isLightboxOpen: false
        });
    }

    render() {
        const { classes, gallery } = this.props;

        return _.isEmpty(gallery) ? null : (
            <div className={classes.root}>
                <GridList cols={2} cellHeight={180} spacing={1} className={classes.gridList}>
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

                <Lightbox
                    currentImage={this.state.currentImage}
                    images={this.state.gallery}
                    showThumbnails={true}
                    showImageCount={false}
                    isOpen={this.state.isLightboxOpen}
                    onClickPrev={this.gotoPrevLightboxImage}
                    onClickNext={this.gotoNextLightboxImage}
                    onClickThumbnail={this.gotoImage}
                    onClose={this.handleCloseLightbox}
                    backdropClosesModal={true}
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