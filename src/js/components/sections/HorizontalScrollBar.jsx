import React, { Component } from 'react';
import PropTypes from 'prop-types';
import _ from 'lodash';

// Material UI Components
import { withStyles } from '@material-ui/core/styles';
import Grid from '@material-ui/core/Grid';
import Typography from '@material-ui/core/Typography';
import IconButton from '@material-ui/core/IconButton';
import animate from '@material-ui/core/internal/animate';

import KeyboardArrowLeft from '@material-ui/icons/KeyboardArrowLeft';
import KeyboardArrowRight from '@material-ui/icons/KeyboardArrowRight';

const styles = theme => ({
    "root": {
        position: 'relative',
    },
    "wrapper": {
        position: 'relative',
        overflowY: 'hidden',
        overflowX: 'scroll',
        whiteSpace: 'nowrap',
        overscrollBehaviorX: "auto",
        paddingTop: theme.spacing.unit,
        paddingBottom: theme.spacing.unit * 2,
    },
    "item": {
        display: 'inline-block'
    },
    "button": {
        position: "absolute",
        top: '48%',
        bottom: 0,
        zIndex: 101,
        [theme.breakpoints.down('sm')]: {
            display: 'none'
        }
    }
});

class HorizontalScrollBar extends Component {
    constructor(props) {
        super(props);

        this.state = {
            showLeftButton: false,
            showRightButton: false,
        };
        
        this.ref = React.createRef();

        this.handleScrollLeft = this.handleScrollLeft.bind(this);
        this.handleScrollRight = this.handleScrollRight.bind(this);
    }

    componentDidMount() {
        if (this.ref.current) {
            this.setState({
                showRightButton: this.ref.current.clientWidth < this.ref.current.scrollWidth
            });
        }
    }

    handleScrollLeft() {
        const diff = this.ref.current.scrollLeft - this.ref.current.clientWidth + this.props.diff;

        animate('scrollLeft', this.ref.current, diff > 0 ? diff : 0);

        this.setState({
            showLeftButton: diff > 0,
            showRightButton: this.ref.current.clientWidth < this.ref.current.scrollWidth,
        });
    }

    handleScrollRight () {
        const diff = this.ref.current.scrollLeft + this.ref.current.clientWidth - this.props.diff;

        animate('scrollLeft', this.ref.current, diff);

        this.setState({
            showLeftButton: this.ref.current.clientWidth < this.ref.current.scrollWidth,
            showRightButton: diff + this.ref.current.clientWidth < this.ref.current.scrollWidth,
        });
    }

    render() {
        const { classes } = this.props;
        
        return (
            
            <div className={classes.root}>
                <div className={classes.wrapper} ref={this.ref}>
                    {
                        this.props.children.map((item, index) => (
                            <div className={classes.item} key={index}>
                                {item} 
                            </div>
                        ))
                    }
                </div>
                <div>
                    <div>
                        {
                            this.state.showLeftButton && <IconButton style={{ left: -48, }}
                                className={classes.button}
                                onClick={this.handleScrollLeft}
                            >
                                <KeyboardArrowLeft />
                            </IconButton>
                        }
                    </div>
                    <div >
                        {
                            this.state.showRightButton && <IconButton
                                className={classes.button} style={{ right: -48, }}
                                onClick={this.handleScrollRight}
                            >
                                <KeyboardArrowRight />
                            </IconButton>
                        }
                    </div>
                </div>
            
            </div>
        );
    }
};

HorizontalScrollBar.defaultProps = {
    "diff": 100,
}

HorizontalScrollBar.propTypes = {
    "classes": PropTypes.object.isRequired,
    "diff": PropTypes.number,
};

export default withStyles(styles)(HorizontalScrollBar);