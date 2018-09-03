import React, { Component } from 'react';
import PropTypes from 'prop-types';
import _ from 'lodash';
import ContentLoader from 'react-content-loader';

class Skeleton extends Component {
    render() {

        return (
            <ContentLoader width={this.props.width} height={this.props.height} primaryColor='#f3f3f3' secondaryColor='#ecebeb'>
                <rect x="0" y="0" rx="0" ry="0" width="1600" height="900" />
            </ContentLoader>
        );
    }
}

Skeleton.defaultProps = {
    width: 1600,
    height: 900,
}

Skeleton.propTypes = {
    width: PropTypes.number.isRequired,
    height: PropTypes.number.isRequired,
};

export default Skeleton;