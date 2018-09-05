import React, { Component } from 'react';
import PropTypes from 'prop-types';
import Lightbox from 'react-images';

class LigntboxModule extends Component {
    constructor(props) {
        super(props);

        this.state = {
            currentImage: props.currentImage,
        };

        this.handleGotoPrevLightboxImage = this.handleGotoPrevLightboxImage.bind(this);
        this.handleGotoNextLightboxImage = this.handleGotoNextLightboxImage.bind(this);
        this.handleGotoImage = this.handleGotoImage.bind(this);
    }

    componentDidUpdate(prevProps, prevState) {
        if (prevProps.open !== this.props.open && prevState.currentImage !== this.props.currentImage) {
            this.setState({
                currentImage: this.props.currentImage
            });
        }
    }

    handleGotoPrevLightboxImage() {
        this.setState({
            currentImage: this.state.currentImage - 1,
        });
    }

    handleGotoNextLightboxImage() {
        this.setState({
            currentImage: (this.state.currentImage + 1) % this.props.images.length,
        });
    }

    handleGotoImage(index) {
        this.setState({
            currentImage: index
        });
    }

    render() {
        return (
            <div>
                <Lightbox
                    currentImage={this.state.currentImage}
                    images={this.props.images}
                    showThumbnails
                    showImageCount
                    backdropClosesModal
                    isOpen={this.props.open}
                    onClose={this.props.onClose}
                    onClickPrev={this.handleGotoPrevLightboxImage}
                    onClickNext={this.handleGotoNextLightboxImage}
                    onClickThumbnail={this.handleGotoImage}
                />
            </div>
        );
    }
}

LigntboxModule.defaultProps = {
    "open": false,
    "currentImage": 0,
    "images": [],
}

LigntboxModule.prototypes = {
    "open": PropTypes.bool.isRequired,
    "currentImage": PropTypes.number.isRequired,
    "images": PropTypes.array.isRequired,
}

export default LigntboxModule;