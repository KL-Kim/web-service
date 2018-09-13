import React, { PureComponent } from 'react';
import PropTypes from 'prop-types';
import { Link } from 'react-router-dom'
import isEmpty from 'lodash/isEmpty';

// Material UI Components
import { withStyles } from '@material-ui/core/styles';
import FormControl from '@material-ui/core/FormControl';
import Input from '@material-ui/core/Input';
import InputAdornment from '@material-ui/core/InputAdornment';
import Divider from '@material-ui/core/Divider';
import ListItemText from '@material-ui/core/ListItemText';
import List from '@material-ui/core/List';
import ListItem from '@material-ui/core/ListItem';
import IconButton from '@material-ui/core/IconButton';

// Material UI Icons
import Search from '@material-ui/icons/Search';

// Helpers
import searchCategoryOrTag from 'js/helpers/searchCategoryOrTag';

const styles = theme => ({
    "divider": {
        marginTop: theme.spacing.unit,
        marginBottom: theme.spacing.unit,
    },
});

class SearchBar extends PureComponent {
    constructor(props) {
        super(props);

        this.state = {
            "search": '',
            "typingTimeout": null,
            "categories": [],
            "tags": [],
        };
    }

    componentDidUpdate(prevProps) {
        if (prevProps.searchedQuery !== this.props.searchedQuery && !isEmpty(this.props.searchedQuery)) {
            this.setState({
                search: this.props.searchedQuery
            });

            this.handleSearchCategoryOrTag(this.props.searchedQuery);
        }
    }

    handleChange = e => {
        const { value } = e.target

        if (this.state.typingTimeout) {
            clearTimeout(this.state.typingTimeout);
        }

        if (value) {
            this.setState({
                search: value,
                typing: false,
                typingTimeout: setTimeout(() => {
                    this.handleSearchCategoryOrTag(value);
                }, 300),
            });
        } 
        else {
            this.setState({
                search: '',
                "categories": [],
                "tags": [],
            })
        }
    }

    handleSearchCategoryOrTag = query =>  {
        if (query) {
            const categories = searchCategoryOrTag('category', query);
            const tags = searchCategoryOrTag('tag', query);
        
            this.setState({
                categories: [...categories],
                tags: [...tags],
            });
        }
    }

    handleSearch = e => {
        e.preventDefault();
    
        if (this.state.search) {
            this.props.getBusinessList({
                search: this.state.search,
            });

            this.props.onSearch(this.state.search);
        }
    }

    render() {
        const { classes } = this.props;

        return (
            <div>
                <form onSubmit={this.handleSearch}>
                    <FormControl fullWidth>
                        <Input
                            type="search"
                            name="search"
                            autoFocus
                            disableUnderline
                            autoComplete="off"
                            placeholder="Search..."
                            value={this.state.search}
                            onChange={this.handleChange}
                            startAdornment={
                                <InputAdornment position="start">
                                    <IconButton
                                        aria-label="Search Icon"
                                        onClick={this.handleSearch}
                                    >
                                        <Search />
                                    </IconButton>
                                </InputAdornment>
                            }
                        />
                    </FormControl>
                </form>

                {
                    isEmpty(this.state.categories)
                        ?   null
                        :   <div>
                                <Divider className={classes.divider} />
                                <List>
                                    {
                                    this.state.categories.map(item => (
                                        <Link to={{
                                            pathname: "/business/category/" + item.enName,
                                            hash: '#',
                                            state: {
                                            category: item
                                            }
                                        }} 
                                        key={item._id}
                                        >
                                            <ListItem button>
                                                <ListItemText primary={item.krName + " (Category)"} />
                                            </ListItem>
                                        </Link>
                                    ))
                                    }
                                </List>
                            </div>
                }

                {
                    isEmpty(this.state.tags)
                        ?   null
                        :   <div>
                                <Divider className={classes.divider} />
                                <List>
                                    {
                                    this.state.tags.map((item) => (
                                        <Link to={{
                                            pathname: "/business/tag/" + item.enName,
                                            hash: '#',
                                            state: {
                                            tag: item
                                            }
                                        }} 
                                        key={item._id}
                                        >
                                            <ListItem button>
                                                <ListItemText primary={"#" + item.krName} />
                                            </ListItem>
                                        </Link>
                                    ))
                                    }
                                </List>
                            </div>
                }
            </div>
        );
    }
}

SearchBar.prototypes = {
    "classes": PropTypes.object.isRequired,
};

export default withStyles(styles)(SearchBar);