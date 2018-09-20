import React, { Component } from 'react';
import PropTypes from 'prop-types';
import isEmpty from 'lodash/isEmpty';

// Material UI Components
import { withStyles } from '@material-ui/core/styles';

// Custom Components
import CustomButton from 'js/components/utils/Button';
import HorizontalScrollBar from 'js/components/utils/HorizontalScrollBar';

const styles = theme => ({
    "chipBar": {
        margin: 0,
    },
    "chip": {
        width: 'auto',
        display: 'inline-block',
        marginTop: theme.spacing.unit * 2,
        marginBottom: theme.spacing.unit * 2,
        marginRight: theme.spacing.unit,
        paddingTop: theme.spacing.unit,
        paddingBottom: theme.spacing.unit,
        paddingLeft: theme.spacing.unit * 3,
        paddingRight: theme.spacing.unit * 3,
        fontSize: theme.typography.pxToRem(16),
    },
});

class ChipsBar extends Component {
    constructor(props) {
        super(props);

        this.state = {
            selected: '',
        };
    }

    shouldComponentUpdate(nextProps, nextState) {
        if (nextProps.chips !== this.props.chips) {
            return true;
        }
        else if (nextState.selected !== this.state.selected) {
            return true;
        }
        else {
            return false;
        }
    }

    handleSelect = item => e => {
        this.props.onSelect(item);

        this.setState({
            selected: item._id
        });
    }

    render() {
        const { classes } = this.props;

        return (
            <div>
                <HorizontalScrollBar className={classes.chipBar} itemHeight={70}>
                    <CustomButton
                        color={isEmpty(this.state.selected) ? "primary" : 'white'}
                        round
                        className={classes.chip}
                        onClick={this.handleSelect('')}
                    >
                        All
                    </CustomButton>

                    {
                        isEmpty(this.props.chips)
                            ?   null
                            :   this.props.chips.map(item => (
                                    <CustomButton
                                        key={item._id}
                                        color={this.state.selected === item._id ? "primary" : 'white'}
                                        round
                                        className={classes.chip}
                                        onClick={this.handleSelect(item)}
                                    >
                                        {
                                            this.props.type === "tag" && '#'
                                        }                                    
                                        {item.krName}
                                    </CustomButton>
                                ))
                    }
                </HorizontalScrollBar>
            </div>
        )
    }
}

ChipsBar.prototypes = {
    "classes": PropTypes.object.isRequired,
    "chips": PropTypes.array.isRequired,
    "onSelect": PropTypes.func.isRequired,
}

export default withStyles(styles)(ChipsBar);