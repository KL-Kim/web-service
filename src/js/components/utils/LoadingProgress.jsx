import React, { Component } from 'react';
import PropTypes from 'prop-types';

// Material UI Components
import Fade from '@material-ui/core/Fade';
import CircularProgress from '@material-ui/core/CircularProgress';

class LoadingProgress extends Component {
    render() {
        return (
            <div style={{ 'textAlign': 'center' }}>
                <Fade
                    in={this.props.isLoading}
                    style={{
                        transitionDelay: '500ms',
                    }}
                    unmountOnExit
                    >
                    <CircularProgress size={this.props.size} />
                </Fade>
            </div>
        )
    }
}

LoadingProgress.propTypes = {
    isLoading: PropTypes.bool.isRequired,
}

export default LoadingProgress;