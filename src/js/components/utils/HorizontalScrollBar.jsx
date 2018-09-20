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
        overflowY: 'hidden',
        whiteSpace: 'normal',
    },
    "container": {
        position: 'relative',
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
        },
    },
    "item": {
        display: 'inline-block',
        paddingBottom: 100,
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
        
        this.containerRef = React.createRef();

        this.handleScrollLeft = this.handleScrollLeft.bind(this);
        this.handleScrollRight = this.handleScrollRight.bind(this);
        this.handleScroll = this.handleScroll.bind(this);
    }

    componentDidMount() {
        if (this.containerRef.current) {
            this.setState({
                showRightButton: this.containerRef.current.clientWidth < this.containerRef.current.scrollWidth
            });

            this.containerRef.current.addEventListener("scroll", this.handleScroll);
        }
    }

    componentWillUnmount() {
        if (this.containerRef.current) {
            this.containerRef.current.removeEventListener("scroll", this.handleScroll);
        }
    }

    handleScroll() {
        const node = this.containerRef.current;

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
        const diff = this.containerRef.current.scrollLeft - this.containerRef.current.clientWidth + this.props.diff;

        animate('scrollLeft', this.containerRef.current, diff > 0 ? diff : 0);
    }

    handleScrollRight () {
        const diff = this.containerRef.current.scrollLeft + this.containerRef.current.clientWidth - this.props.diff;

        animate('scrollLeft', this.containerRef.current, diff);    
    }

    render() {
        const { classes } = this.props;
        
        return (
            <div className={classes.root} style={{ height: this.props.itemHeight }}>
                <div className={classes.container}>
                    <div className={classes.wrapper} ref={this.containerRef}>
                        {
                            this.props.children.map((item, index) => (
                                <div className={classes.item} key={index}>
                                    {item} 
                                </div>
                            ))
                        }
                    </div>
                </div>   

                <div>
                    <div className={classes.buttonWrapper} style={{ left: 0, }}>
                        {
                            this.state.showLeftButton 
                                &&  <IconButton
                                        className={classes.button}
                                        onClick={this.handleScrollLeft}
                                    >
                                        <KeyboardArrowLeft />
                                    </IconButton>
                        }
                    </div>
                    <div className={classes.buttonWrapper} style={{ right: 0, }}>
                        {
                            this.state.showRightButton 
                                &&  <IconButton
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