import React, { PureComponent } from 'react';
import PropTypes from 'prop-types';

// Material UI Components
import { withStyles } from '@material-ui/core/styles';
import IconButton from '@material-ui/core/IconButton';
import animate from '@material-ui/core/internal/animate';

// Material UI Icons
import KeyboardArrowLeft from '@material-ui/icons/KeyboardArrowLeft';
import KeyboardArrowRight from '@material-ui/icons/KeyboardArrowRight';

const styles = theme => ({
    "root": {
        position: 'relative',
        width: '100%',
        height: '100%',
    },
    "wrapper": {
        position: 'relative',
        overflowY: 'hidden',
        overflowX: 'auto',
        whiteSpace: 'nowrap',
        overscrollBehaviorX: "none",
        WebkitOverflowScrolling: "touch",
        [theme.breakpoints.down('xs')]: {
            paddingTop: 0,
            paddingBottom: 0,
        }
    },
    "item": {
        display: 'inline-block',
    },
    "buttonWrapper": {
        position: "absolute",
        top: 0,
        bottom: 0,
        zIndex: 101,
        [theme.breakpoints.down('sm')]: {
            display: 'none'
        }
    },
    "button": {
        backgroundColor: '#fff',
        border: '1px solid #aaa',
        position: "relative",
        top: '50%',
        transform: 'translateY(-50%)',
    }
});

class HorizontalScrollBar extends PureComponent {
    constructor(props) {
        super(props);

        this.state = {
            showLeftButton: false,
            showRightButton: false,
        };
        
        this.ref = React.createRef();

        this.handleScrollLeft = this.handleScrollLeft.bind(this);
        this.handleScrollRight = this.handleScrollRight.bind(this);
        this.handleScroll = this.handleScroll.bind(this);
    }

    componentDidMount() {
        if (this.ref.current) {
            this.setState({
                showRightButton: this.ref.current.clientWidth < this.ref.current.scrollWidth
            });
            this.ref.current.addEventListener("scroll", this.handleScroll);
        }
    }

    componentWillUnmount() {
        if (this.ref.current) {
            this.ref.current.removeEventListener("scroll", this.handleScroll);
        }
    }

    handleScroll() {
        const node = this.ref.current;

        if (node.scrollLeft > 0) {
            this.setState({
                showLeftButton: true,  
            });
        } else {
            this.setState({
                showLeftButton: false,  
            });
        }

        if (node.scrollLeft + node.clientWidth < node.scrollWidth) {
            this.setState({
                showRightButton: true,
            });
        } else {
            this.setState({
                showRightButton: false,
            });
        }
    }

    handleScrollLeft() {
        const diff = this.ref.current.scrollLeft - this.ref.current.clientWidth + this.props.diff;

        animate('scrollLeft', this.ref.current, diff > 0 ? diff : 0);
    }

    handleScrollRight () {
        const diff = this.ref.current.scrollLeft + this.ref.current.clientWidth - this.props.diff;

        animate('scrollLeft', this.ref.current, diff);    
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
                    <div className={classes.buttonWrapper} style={{ left: -24, }}>
                        {
                            this.state.showLeftButton && <IconButton
                                className={classes.button}
                                onClick={this.handleScrollLeft}
                            >
                                <KeyboardArrowLeft />
                            </IconButton>
                        }
                    </div>
                    <div className={classes.buttonWrapper} style={{ right: -24, }}>
                        {
                            this.state.showRightButton && <IconButton
                                className={classes.button}
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
    "children": PropTypes.array.isRequired,
    "diff": PropTypes.number,
};

export default withStyles(styles)(HorizontalScrollBar);