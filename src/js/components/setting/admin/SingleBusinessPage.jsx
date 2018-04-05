import React, { Component } from 'react';
import PropTypes from 'prop-types';
import { connect } from 'react-redux';
import _ from 'lodash';
import { withStyles } from 'material-ui/styles';
import Grid from 'material-ui/Grid';
import Paper from 'material-ui/Paper';
import Typography from 'material-ui/Typography';
import Table, { TableBody, TableCell, TableHead, TableRow, } from 'material-ui/Table';
import Input, { InputLabel, InputAdornment } from 'material-ui/Input';
import Select from 'material-ui/Select';
import TextField from 'material-ui/TextField';
import Button from 'material-ui/Button';
import { MenuItem } from 'material-ui/Menu';
import Checkbox from 'material-ui/Checkbox';
import { ListItemText } from 'material-ui/List';
import Dialog, {
  DialogActions,
  DialogContent,
  DialogContentText,
  DialogTitle,
} from 'material-ui/Dialog';
import IconButton from 'material-ui/IconButton';
import Search from 'material-ui-icons/Search';
import Chip from 'material-ui/Chip';
import { FormControl, FormControlLabel, FormLabel } from 'material-ui/Form';
import Radio, { RadioGroup } from 'material-ui/Radio';

import SettingContainer from '../SettingContainer';
import Provinces from '../../../constants/provinces';
import { getCategoriesList } from '../../../actions/category.actions.js';
import { getTagsList } from '../../../actions/tag.actions.js';
import { getCities, getAreas } from '../../../actions/pca.actions';
import { addBusiness } from '../../../actions/business.actions';

import image from '../../../../css/logo.svg';

const languageList = [
  '中文',
  '한국어',
  'English',
  '日本语'
];

const paymentList = [
  'Alipay',
  'Wechat Pay',
  'UnionPay',
  'VISA',
  'MasterCard',
];

const styles = (theme) => ({
  "container": {
    marginBottom: theme.spacing.unit * 2,
  },
  "paper": {
    padding: theme.spacing.unit * 3,
    marginBottom: theme.spacing.unit * 2,
  },
  "buttonContainer": {
    "display": "flex",
    "justifyContent": "flex-end",
  },
  "button": {
    "margin": 0,
    "width": 150,
  },
});

class SingleBusinessPage extends Component {
  constructor(props) {
    super(props);

    if (!_.isEmpty(props.location.state.business)) {
      const business = props.location.state.business;

      this.state = {
        _id: business._id || '',
        "category": {
          _id: business.category._id || '',
          code: business.category.code || '',
          krName: business.category.krName || '',
          cnName: business.category.cnName || '',
          enName: business.category.enName || '',
        },
        state: business.state || '',
        cnName: business.cnName || '',
        krName: business.krName || '',
        enName: business.enName || '',
        tel: business.tel || '',
        priceRange: business.priceRange || '',
        supportedLanguage: business.supportedLanguage || '',
        payment: business.payment || '',
        delivery: business.delivery || '',
        status: business.status || '',
        "address": {
          province: {
            name: business.address.province.name || '',
            code: business.address.province.code || '',
          },
          city: {
            name: business.address.city.name || '',
            code: business.address.city.code || '',
          },
          area: {
            name: business.address.area.name || '',
            code: business.address.area.code || '',
          },
          street: business.address.street || '',
        },
        "geo": {
          lat: business.geo.lat || '',
          long: business.geo.long || '',
        },
        "openningHoursSpec": {
          mon: _.isEmpty(business.openningHoursSpec) ? '' : (business.openningHoursSpec.mon || ''),
          tue: _.isEmpty(business.openningHoursSpec) ? '' : (business.openningHoursSpec.tue || ''),
          wed: _.isEmpty(business.openningHoursSpec) ? '' : (business.openningHoursSpec.wed || ''),
          thu: _.isEmpty(business.openningHoursSpec) ? '' : (business.openningHoursSpec.thu || ''),
          fri: _.isEmpty(business.openningHoursSpec) ? '' : (business.openningHoursSpec.fri || ''),
          sat: _.isEmpty(business.openningHoursSpec) ? '' : (business.openningHoursSpec.sat || ''),
          sun: _.isEmpty(business.openningHoursSpec) ? '' : (business.openningHoursSpec.sun || ''),
        },
        rest: business.rest || '',
        subDepartments: _.isEmpty(business.subDepartments) ? [] : business.subDepartments.slice(),
        description: business.description || '',
        "viewsCount": business.viewsCount || 0,
        "favoredCount": business.favoredCount || 0,
        ratingAverage: business.ratingAverage || 0,
        "event": business.event || '',
        menu: _.isEmpty(business.menu) ? [] : business.menu.slice(),
        imagesUri: _.isEmpty(business.imagesUri) ? [] : business.imagesUri.slice(),
        newMenuName: '',
        newMenuPrice: '',
        newMenuIsHot: '',
        newMenuPrice: '',
        "subDepartmentsDialogOpen": false,
        "addMenuDialogOpen": false,
        "isNew": false,
        "menuIndex": null,
      };

      if (_.isEmpty(business.tags))
      {
        this.state.tags = [];
      } else {
        let tags = [];

        business.tags.map(tag => {
          tags.push(tag.krName);
        });

        this.state.tags = tags.slice();
      }

    } else {
      this.state = {
        _id: '',
        "category": {
          _id: '',
          code: '',
          krName: '',
          cnName: '',
          enName: '',
        },
        "tags": [],
        state: 'draft',
        cnName: '',
        krName: '',
        enName: '',
        tel: '',
        priceRange: '',
        supportedLanguage: [],
        payment: [],
        delivery: '',
        status: 'normal',
        "address": {
          province: {
            name: '',
            code: '',
          },
          city: {
            name: '',
            code: '',
          },
          area: {
            name: '',
            code: '',
          },
          street: '',
        },
        "geo": {
          lat: 0,
          long: 0,
        },
        openningHoursSpec: {
          mon: '',
          tue: '',
          wed: '',
          thurs: '',
          thu: '',
          fri: '',
          sat: '',
          sun: '',
        },
        rest: '',
        subDepartments: [],
        description: '',
        ratingAverage: 0,
        "viewsCount": 0,
        "favoredCount": 0,
        "event": '',
        menu: [],
        imagesUri: [],
        newMenuName: '',
        newMenuPrice: '',
        newMenuIsHot: 'no',
        newMenuIsNew: 'no',
        "subDepartmentsDialogOpen": false,
        "addMenuDialogOpen": false,
        "isNew": true,
        "menuIndex": null,
      }
    }

    this.handleSubmit = this.handleSubmit.bind(this);
    this.handleChange = this.handleChange.bind(this);
    this.handleOpenSubDepartmentsDialog = this.handleOpenSubDepartmentsDialog.bind(this);
    this.handleCloseSubDepartmentsDialog = this.handleCloseSubDepartmentsDialog.bind(this);
    this.handleOpenAddMenuDialog = this.handleOpenAddMenuDialog.bind(this);
    this.handleCloseAddMenuDialog = this.handleCloseAddMenuDialog.bind(this);
    this.handleAddNewMenu = this.handleAddNewMenu.bind(this);
    this.handleRowClick = this.handleRowClick.bind(this);
    this.handleDeleteMenu = this.handleDeleteMenu.bind(this);
  }

  componentDidMount() {
    if (_.isEmpty(this.props.categoriesList)) {
      this.props.getCategoriesList();
    }

    if (_.isEmpty(this.props.tagsList)) {
      this.props.getTagsList();
    }
  }

  handleChange(e) {
    const { name, value } = e.target;

    switch (name) {
      case 'category':
        this.setState({
          "category": {
            _id: value._id,
            code: value.code,
            krName: value.krName,
            cnName: value.cnName,
            enName: value.enName,
          }
        });
        break;

      case 'province':
        this.setState({
          "address": {
            ...this.state.address,
            "province": {
              name: value.name,
              code: value.code
            },

          }
        });
        this.props.getCities(value.code);
        break;

      case 'city':
        this.setState({
          "address": {
            ...this.state.address,
            "city": {
              name: value.name,
              code: value.code
            }
          }
        });
        this.props.getAreas(value.code);
        break;

      case 'area':
        this.setState({
          "address": {
            ...this.state.address,
            "area": {
              name: value.name,
              code: value.code
            }
          }
        });
        break;

      case 'street':
        this.setState({
          "address": {
            ...this.state.address,
            "street": value
          }
        });
        break;

      case 'lat':
        this.setState({
          "geo": {
            ...this.state.geo,
            "lat": value,
          }
        });
        break;

      case 'long':
        this.setState({
          "geo": {
            ...this.state.geo,
            "long": value,
          }
        });
        break;

      case 'mon':
        this.setState({
          "openningHoursSpec": {
            ...this.state.openningHoursSpec,
            "mon": value,
          }
        });
        break;

      case 'tue':
        this.setState({
          "openningHoursSpec": {
            ...this.state.openningHoursSpec,
            "tue": value,
          }
        });
        break;

      case 'wed':
        this.setState({
          "openningHoursSpec": {
            ...this.state.openningHoursSpec,
            "wed": value,
          }
        });
        break;

      case 'thu':
        this.setState({
          "openningHoursSpec": {
            ...this.state.openningHoursSpec,
            "thu": value,
          }
        });
        break;

      case 'fri':
        this.setState({
          "openningHoursSpec": {
            ...this.state.openningHoursSpec,
            "fri": value,
          }
        });
        break;

      case 'sat':
        this.setState({
          "openningHoursSpec": {
            ...this.state.openningHoursSpec,
            "sat": value,
          }
        });
        break;

      case 'sun':
        this.setState({
          "openningHoursSpec": {
            ...this.state.openningHoursSpec,
            "sun": value,
          }
        });
        break;

      default:
        this.setState({
          [name]: value
        });
    }

  }

  handleOpenSubDepartmentsDialog() {
    this.setState({
      subDepartmentsDialogOpen: true,
    });
  }

  handleCloseSubDepartmentsDialog() {
    this.setState({
      subDepartmentsDialogOpen: false,
    });
  }

  handleOpenAddMenuDialog() {
    this.setState({
      addMenuDialogOpen: true
    });
  }

  handleCloseAddMenuDialog() {
    this.setState({
      addMenuDialogOpen: false,
      menuIndex: null,
    });
  }

  handleAddNewMenu() {
    let menu = this.state.menu.slice();
    if (_.isNumber(this.state.menuIndex)) {
      menu[this.state.menuIndex] = Object.assign({}, {
        name: this.state.newMenuName,
        price: this.state.newMenuPrice,
        hot: this.state.newMenuIsHot,
        new: this.state.newMenuIsNew,
      });
    } else {
      menu.push({
        name: this.state.newMenuName,
        price: this.state.newMenuPrice,
        hot: this.state.newMenuIsHot,
        new: this.state.newMenuIsNew,
      });
    }

    this.setState({
      menu: menu,
      menuIndex: null,
      addMenuDialogOpen: false,
      newMenuName: '',
      newMenuPrice: '',
      newMenuIsHot: 'no',
      newMenuIsNew: 'no',
    });
  }

  handleDeleteMenu() {
    _.isNumber(this.state.menuIndex) ? this.state.menu.splice(this.state.menuIndex, 1) : '';
    const newMenu = this.state.menu.slice();

    if (_.isEmpty(this.state.menuIndex)) {
      this.setState({
        addMenuDialogOpen: false,
        menuIndex: null,
        newMenuName: '',
        newMenuPrice: '',
        newMenuIsHot: 'no',
        newMenuIsNew: 'no',
      });
    } else {
      this.setState({
        addMenuDialogOpen: false,
        menuIndex: null,
        menu: newMenu,
        newMenuName: '',
        newMenuPrice: '',
        newMenuIsHot: 'no',
        newMenuIsNew: 'no',
      });
    }
  }

  handleRowClick(e, menu, index) {
    this.setState({
      addMenuDialogOpen: true,
      newMenuName: menu.name,
      newMenuPrice: menu.price,
      newMenuIsHot: menu.hot,
      newMenuIsNew: menu.new,
      menuIndex: index,
    });
  }

  handleSubmit(e) {
    if (this.state.krName && this.state.cnName && this.state.enName && this.state.tel) {
      const data = {
        state: this.state.state || '',
        cnName: this.state.cnName || '',
        krName: this.state.krName || '',
        enName: this.state.enName || '',
        tel: this.state.tel || '',
        priceRange: this.state.priceRange || '',
        supportedLanguage: this.state.supportedLanguage || '',
        payment: this.state.payment || '',
        delivery: this.state.delivery || '',
        status: this.state.status || '',
        "address": {
          province: {
            name: this.state.address.province.name || '',
            code: this.state.address.province.code || '',
          },
          city: {
            name: this.state.address.city.name || '',
            code: this.state.address.city.code || '',
          },
          area: {
            name: this.state.address.area.name || '',
            code: this.state.address.area.code || '',
          },
          street: this.state.address.street || '',
        },
        "geo": {
          lat: this.state.geo.lat || '',
          long: this.state.geo.long || '',
        },
        "openningHoursSpec": {
          mon: _.isEmpty(this.state.openningHoursSpec) ? '' : (this.state.openningHoursSpec.mon || ''),
          tue: _.isEmpty(this.state.openningHoursSpec) ? '' : (this.state.openningHoursSpec.tue || ''),
          wed: _.isEmpty(this.state.openningHoursSpec) ? '' : (this.state.openningHoursSpec.wed || ''),
          thu: _.isEmpty(this.state.openningHoursSpec) ? '' : (this.state.openningHoursSpec.thu || ''),
          fri: _.isEmpty(this.state.openningHoursSpec) ? '' : (this.state.openningHoursSpec.fri || ''),
          sat: _.isEmpty(this.state.openningHoursSpec) ? '' : (this.state.openningHoursSpec.sat || ''),
          sun: _.isEmpty(this.state.openningHoursSpec) ? '' : (this.state.openningHoursSpec.sun || ''),
        },
        rest: this.state.rest || '',
        subDepartments: _.isEmpty(this.state.subDepartments) ? [] : this.state.subDepartments,
        description: this.state.description || '',
        "event": this.state.event || '',
        menu: _.isEmpty(this.state.menu) ? [] : this.state.menu,
        imagesUri: _.isEmpty(this.state.imagesUri) ? [] : this.state.imagesUri,
      }

      // Set business id
      if (this.state._id) {
        data._id = this.state._id;
      }

      // Set business category id
      if (this.state.category) {
        data.category = this.state.category._id
      }

      // Set business tag
      if (this.state.tags) {
        let tags = [];
        let index;

        this.state.tags.map(tag => {
          index = _.findIndex(this.props.tagsList, (item) => {
            return item.krName == tag
          });

          if (index > -1) {
            tags.push(this.props.tagsList[index]._id);
          }

        })

        data.tags = tags.slice();
      }



      this.props.addBusiness(data);
    }
  }


  render() {
    const { classes, location, cities, areas } = this.props;

    return (
      <SettingContainer>
        <div>
          <Grid container spacing={24} alignItems="center" className={classes.container}>
            <Grid item xs={6}>
              <Typography type="display1" gutterBottom>{this.state.cnName + ' - ' + this.state.krName}</Typography>
            </Grid>

            <Grid item xs={6}>
              <div className={classes.buttonContainer}>
                <Button raised color="primary" className={classes.button}
                  onClick={this.handleSubmit}
                  disabled={!(this.state.krName && this.state.cnName && this.state.enName && this.state.tel)}
                >
                  {this.state.isNew ? 'Save' : 'Update'}
                </Button>
              </div>
            </Grid>
          </Grid>

          <Grid container spacing={24} className={classes.container}>
            <Grid item xs={6} cla>
              <Paper>
                <img src={image} alt="Main photo" />
              </Paper>
            </Grid>
            <Grid item xs={6}>
              <Grid container spacing={16}>
                <Grid item xs={3}>
                  <Paper>
                    <img src={image} alt="photo1" />
                  </Paper>
                </Grid>
                <Grid item xs={3}>
                  <Paper>
                    <img src={image} alt="photo2" />
                  </Paper>
                </Grid>
                <Grid item xs={3}>
                  <Paper>
                    <img src={image} alt="photo2" />
                  </Paper>
                </Grid>
                <Grid item xs={3}>
                  <Paper>
                    <img src={image} alt="photo2" />
                  </Paper>
                </Grid>
                <Grid item xs={3}>
                  <Paper>
                    <img src={image} alt="photo2" />
                  </Paper>
                </Grid>
              </Grid>
            </Grid>
          </Grid>

          <Grid container spacing={24} alignItems="center">
            <Grid item xs={3}>
              <Paper className={classes.paper}>
                <FormControl fullWidth>
                  <InputLabel htmlFor="category">Category</InputLabel>
                  <Select
                    name="category"
                    value={this.state.category.krName}
                    onChange={this.handleChange}
                    input={<Input id="category" />}
                    renderValue={selected => selected}
                  >

                    {_.isEmpty(this.props.categoriesList) ? '' : this.props.categoriesList.map(item => (
                      <MenuItem
                        key={item.code}
                        value={{
                          _id: item._id,
                          code: item.code,
                          krName: item.krName,
                          cnName: item.cnName,
                          enName: item.enName,
                        }}
                      >
                        <ListItemText primary={item.krName} />
                      </MenuItem>
                    ))}
                  </Select>
                </FormControl>
              </Paper>
            </Grid>

            <Grid item xs={3}>
              <Paper className={classes.paper}>
                <FormControl fullWidth>
                  <InputLabel htmlFor="tag">Tags</InputLabel>
                  <Select multiple
                    name="tags"
                    value={this.state.tags}
                    onChange={this.handleChange}
                    input={<Input id="tag" />}
                    renderValue={selected => selected.join(', ')}
                  >
                    {
                      _.isEmpty(this.props.tagsList) ? '' : this.props.tagsList.map(item => (
                        <MenuItem
                          key={item.code}
                          value={item.krName}
                        >
                          <Checkbox checked={this.state.tags.indexOf(item.krName) > -1} />
                          <ListItemText primary={item.krName} />
                        </MenuItem>
                      ))
                    }
                  </Select>
                </FormControl>
              </Paper>
            </Grid>

            <Grid item xs={6}>
              <Paper className={classes.paper}>
                <Grid container>
                  <Grid item xs={6}>
                    <Typography type="title">Sub Departments</Typography>
                  </Grid>

                  <Grid item xs={6}>
                    <div className={classes.buttonContainer}>
                      <Button raised color="primary" onClick={this.handleOpenSubDepartmentsDialog}>Add sub</Button>
                    </div>
                  </Grid>

                  <Grid item xs={12}>
                    {
                      this.state.subDepartments.map((data, index) => (
                        <Chip
                          key={index}
                          label={data.krName}
                          onDelete={this.handleDeleteChip(data)}
                          className={classes.chip}
                        />
                      ))
                    }
                  </Grid>
                </Grid>
              </Paper>
            </Grid>
          </Grid>

          <Paper className={classes.paper}>
            <Grid container spacing={16} alignItems="center">
              <Grid item xs={12}>
                <Typography type="title">Basic Info</Typography>
              </Grid>

              <Grid item xs={3}>
                <TextField fullWidth required
                  id="cnName"
                  label="中文名"
                  margin="normal"
                  name="cnName"
                  value={this.state.cnName}
                  onChange={this.handleChange} />
              </Grid>

              <Grid item xs={3}>
                <TextField fullWidth required
                  id="krName"
                  label="한국어"
                  margin="normal"
                  name="krName"
                  value={this.state.krName}
                  onChange={this.handleChange} />
              </Grid>

              <Grid item xs={3}>
                <TextField fullWidth required
                  id="enName"
                  label="English"
                  margin="normal"
                  value={this.state.enName}
                  name="enName"
                  onChange={this.handleChange} />
              </Grid>

              <Grid item xs={3}>
                <TextField fullWidth required
                  id="tel"
                  label="Tel"
                  margin="normal"
                  value={this.state.tel}
                  name="tel"
                  onChange={this.handleChange} />
              </Grid>

              <Grid item xs={3}>
                <TextField
                  fullWidth
                  id="priceRange"
                  label="Price Range"
                  margin="normal"
                  value={this.state.priceRange}
                  name="priceRange"
                  onChange={this.handleChange} />
              </Grid>

              <Grid item xs={3}>
                <TextField fullWidth
                  id="delivery"
                  label="Delivery"
                  margin="normal"
                  value={this.state.delivery}
                  name="delivery"
                  onChange={this.handleChange} />
              </Grid>

              <Grid item xs={3}>
                <FormControl fullWidth>
                  <InputLabel htmlFor="language">Supported language</InputLabel>
                  <Select multiple
                    name="supportedLanguage"
                    value={this.state.supportedLanguage}
                    onChange={this.handleChange}
                    input={<Input id="language" />}
                    renderValue={selected => selected.join(', ')}
                  >
                    {
                      languageList.map((item, index) => (
                        <MenuItem
                          key={index}
                          value={item}
                        >
                          <Checkbox checked={this.state.supportedLanguage.indexOf(item) > -1} />
                          <ListItemText primary={item} />
                        </MenuItem>
                      ))
                    }
                  </Select>
                </FormControl>
              </Grid>

              <Grid item xs={3}>
                <FormControl fullWidth>
                  <InputLabel htmlFor="payment">Supported payment</InputLabel>
                  <Select multiple
                    name="payment"
                    value={this.state.payment}
                    onChange={this.handleChange}
                    input={<Input id="payment" />}
                    renderValue={selected => selected.join(', ')}
                  >
                    {
                      paymentList.map((item, index) => (
                        <MenuItem
                          key={index}
                          value={item}
                        >
                          <Checkbox checked={this.state.payment.indexOf(item) > -1} />
                          <ListItemText primary={item} />
                        </MenuItem>
                      ))
                    }
                  </Select>
                </FormControl>
              </Grid>

              <Grid item xs={6}>
                <FormControl fullWidth >
                  <FormLabel component="label" required>State</FormLabel>
                  <RadioGroup
                    row
                    aria-label="state"
                    name="state"
                    value={this.state.state}
                    onChange={this.handleChange}
                  >
                    <FormControlLabel value="draft" control={<Radio />} label="Draft" />
                    <FormControlLabel value="published" control={<Radio />} label="Published" />
                    <FormControlLabel value="deleted" control={<Radio />} label="Deleted" />
                  </RadioGroup>
                </FormControl>
              </Grid>

              <Grid item xs={6}>
                <FormControl fullWidth >
                  <FormLabel component="label" required>Business Status</FormLabel>
                  <RadioGroup
                    row
                    aria-label="status"
                    name="status"
                    value={this.state.status}
                    onChange={this.handleChange}
                  >
                    <FormControlLabel value="normal" control={<Radio />} label="Normal" />
                    <FormControlLabel value="dissolute" control={<Radio />} label="Dissolute" />
                  </RadioGroup>
                </FormControl>
              </Grid>

            </Grid>
          </Paper>

          <Grid container spacing={24}>
            <Grid item xs={6}>
              <Paper className={classes.paper}>
                <Grid container spacing={16} alignItems="center">
                  <Grid item xs={12}>
                    <Typography type="title">Address</Typography>
                  </Grid>
                  <Grid item xs={4}>
                    <FormControl fullWidth>
                      <InputLabel htmlFor="province">Province</InputLabel>
                      <Select
                        name="province"
                        className={classes.input}
                        value={this.state.address.province.name}
                        input={<Input id="province" />}
                        onChange={this.handleChange}
                        renderValue={selected => selected}
                      >
                        {_.isEmpty(Provinces) ? '' : Provinces.map(p => (
                          <MenuItem
                            key={p.code}
                            value={{
                              name: p.cnName,
                              code: p.code,
                            }}
                          >
                            <ListItemText primary={p.cnName} />
                          </MenuItem>
                        ))}
                      </Select>
                    </FormControl>
                  </Grid>

                  <Grid item xs={4}>
                    <FormControl fullWidth>
                      <InputLabel htmlFor="city">City</InputLabel>
                      <Select
                        name="city"
                        className={classes.input}
                        value={this.state.address.city.name}
                        input={<Input id="city" />}
                        onChange={this.handleChange}
                        renderValue={selected => selected}
                      >
                        {_.isEmpty(cities)
                          ? <MenuItem key={1} value={{name: '', code: ''}}>Need province</MenuItem>
                          : cities.map(c => (
                            <MenuItem
                              key={c.code}
                              value={{
                                name: c.cnName,
                                code: c.code,
                              }}
                            >
                              <ListItemText primary={c.cnName} />
                            </MenuItem>
                        ))}
                      </Select>
                    </FormControl>
                  </Grid>

                  <Grid item xs={4}>
                    <FormControl fullWidth>
                      <InputLabel htmlFor="area">Area</InputLabel>
                      <Select
                        name="area"
                        className={classes.input}
                        value={this.state.address.area.name}
                        input={<Input id="area" />}
                        onChange={this.handleChange}
                        renderValue={selected => selected}
                      >
                        {_.isEmpty(areas)
                          ? <MenuItem key={1} value={{name: '', code: ''}}>Need city</MenuItem>
                          : areas.map(a => (
                            <MenuItem
                              key={a.code}
                              value={{
                                name: a.cnName,
                                code: a.code,
                              }}
                            >
                              <ListItemText primary={a.cnName} />
                            </MenuItem>
                        ))}
                      </Select>
                    </FormControl>
                  </Grid>

                  <Grid item xs={12}>
                    <TextField fullWidth id="street" label="Street"  margin="normal"
                      value={this.state.address.street}
                      name="street"
                      onChange={this.handleChange} />
                  </Grid>
                </Grid>
              </Paper>
            </Grid>

            <Grid item xs={6}>
              <Paper className={classes.paper}>
                <Grid container spacing={16} alignItems="center">
                  <Grid item xs={12}>
                    <Typography type="title">Geo</Typography>
                  </Grid>

                  <Grid item xs={12}>
                    <TextField fullWidth id="lat" label="Latitude"  margin="normal"
                      value={this.state.geo.lat}
                      name="lat"
                      onChange={this.handleChange}
                    />
                  </Grid>

                  <Grid item xs={12}>
                    <TextField fullWidth id="long" label="Longtitude"  margin="normal"
                      value={this.state.geo.long}
                      name="long"
                      onChange={this.handleChange}
                    />
                  </Grid>

                </Grid>
              </Paper>
            </Grid>

            <Grid item xs={6}>
              <Paper className={classes.paper}>
                <Grid container spacing={16} alignItems="center">
                  <Grid item xs={12}>
                    <Typography type="title">Openning Days & Hours</Typography>
                  </Grid>
                  <Grid item xs={4}>
                    <TextField fullWidth  id="mon" label="Monday"  margin="normal"
                      value={this.state.openningHoursSpec.mon}
                      name="mon"
                      onChange={this.handleChange}
                    />
                  </Grid>

                  <Grid item xs={4}>
                    <TextField fullWidth  id="tue" label="Tuesday"  margin="normal"
                      value={this.state.openningHoursSpec.tue}
                      name="tue"
                      onChange={this.handleChange}
                    />
                  </Grid>

                  <Grid item xs={4}>
                    <TextField fullWidth  id="wed" label="Wednesday"  margin="normal"
                      value={this.state.openningHoursSpec.wed}
                      name="wed"
                      onChange={this.handleChange}
                    />
                  </Grid>

                  <Grid item xs={4}>
                    <TextField fullWidth
                      id="thu"
                      label="Thursday"
                      margin="normal"
                      value={this.state.openningHoursSpec.thu}
                      name="thu"
                      onChange={this.handleChange} />
                  </Grid>

                  <Grid item xs={4}>
                    <TextField fullWidth
                      id="fri"
                      label="Friday"
                      margin="normal"
                      value={this.state.openningHoursSpec.fri}
                      name="fri"
                      onChange={this.handleChange} />
                  </Grid>

                  <Grid item xs={4}>
                    <TextField fullWidth
                      id="sat"
                      label="Saturday"
                      margin="normal"
                      value={this.state.openningHoursSpec.sat}
                      name="sat"
                      onChange={this.handleChange}/>
                  </Grid>

                  <Grid item xs={4}>
                    <TextField fullWidth
                      id="sun"
                      label="Sunday"
                      margin="normal"
                      value={this.state.openningHoursSpec.sun}
                      name="wed"
                      onChange={this.handleChange} />
                  </Grid>

                  <Grid item xs={8}>
                    <TextField fullWidth
                      id="rest"
                      label="Rest Days"
                      margin="normal"
                      value={this.state.rest}
                      name="rest"
                      onChange={this.handleChange} />
                  </Grid>
                </Grid>
              </Paper>
            </Grid>

            <Grid item xs={6}>
              <Paper className={classes.paper}>
                <Grid container spacing={16} alignItems="center">
                  <Grid item xs={12}>
                    <Typography type="title">Statics</Typography>
                  </Grid>

                  <Grid item xs={6}>
                    <TextField fullWidth disabled id="viewsCount" label="Views Count"  margin="normal" defaultValue={this.state.viewsCount} />
                  </Grid>

                  <Grid item xs={6}>
                    <TextField fullWidth disabled id="favoredCount" label="Favored Count"  margin="normal" defaultValue={this.state.favoredCount} />
                  </Grid>

                  <Grid item xs={6}>
                    <TextField fullWidth disabled id="rating" label="Rating"  margin="normal" defaultValue={this.state.ratingAverage} />
                  </Grid>

                  <Grid item xs={6}>
                    <TextField fullWidth disabled id="ratingCount" label="Rating Count"  margin="normal" defaultValue={this.state.ratingAverage} />
                  </Grid>

                </Grid>
              </Paper>
            </Grid>

            <Grid item xs={6}>
              <Paper className={classes.paper}>
                <Typography type="title">Description</Typography>
                <TextField fullWidth multiline id="description" label="Description"  margin="normal" defaultValue={this.state.Description} />
              </Paper>
            </Grid>

            <Grid item xs={6}>
              <Paper className={classes.paper}>
                <Typography type="title">Event</Typography>
                <TextField fullWidth multiline id="event" label="Event"  margin="normal" defaultValue={this.state.event} />
              </Paper>
            </Grid>

            <Grid item xs={12}>
              <Paper className={classes.paper}>
                <Grid container>
                  <Grid item xs={6}>
                    <Typography type="title">Menu</Typography>
                  </Grid>
                  <Grid item xs={6}>
                    <div className={classes.buttonContainer}>
                      <Button raised color="primary" className={classes.button} onClick={this.handleOpenAddMenuDialog}>
                        Add menu
                      </Button>
                    </div>
                  </Grid>
                </Grid>

                <Table className={classes.table}>
                  <TableHead>
                    <TableRow>
                      <TableCell>Index</TableCell>
                      <TableCell>Name</TableCell>
                      <TableCell>Price</TableCell>
                      <TableCell>Hot</TableCell>
                      <TableCell>New</TableCell>
                    </TableRow>
                  </TableHead>
                  <TableBody>
                    {
                      _.isEmpty(this.state.menu) ? (<TableRow></TableRow>)
                      : this.state.menu.map((item, index) => (

                          <TableRow hover key={index}
                            onClick={event => this.handleRowClick(event, item, index)}
                          >
                            <TableCell>{index + 1}</TableCell>
                            <TableCell>{item.name}</TableCell>
                            <TableCell>{item.price}</TableCell>
                            <TableCell>{item.hot}</TableCell>
                            <TableCell>{item.new}</TableCell>
                          </TableRow>

                      ))
                    }
                  </TableBody>
                </Table>
              </Paper>
            </Grid>
          </Grid>

          <Paper className={classes.paper}>
            <Grid container spacing={16} alignItems="center">
              <Grid item xs={12}>
                <Typography type="title">Reviews List</Typography>
              </Grid>
              <Grid item xs={12}>

              </Grid>
            </Grid>
          </Paper>

          <Dialog
            open={this.state.subDepartmentsDialogOpen}
            onClose={this.handleCloseSubDepartmentsDialog}
            aria-labelledby="alert-dialog-title"
            aria-describedby="alert-dialog-description"
          >
            <DialogTitle id="alert-dialog-title">
              Sub Departments
            </DialogTitle>
            <DialogContent id="alert-dialog-description">
              <Grid container>
                <Grid item xs={6}>
                  <form onSubmit={this.handleSearch}>
                    <FormControl fullWidth>
                      <InputLabel htmlFor="adornment-password">Search</InputLabel>
                      <Input
                        id="search"
                        type="text"
                        name="search"
                        onChange={this.handleChange}
                        onKeyPress={this.handleKeyPress}
                        endAdornment={
                          <InputAdornment position="end">
                            <IconButton
                              aria-label="Toggle password visibility"
                              onClick={this.handleSearch}
                            >
                              <Search />
                            </IconButton>
                          </InputAdornment>
                        }
                      />
                    </FormControl>
                  </form>
                </Grid>

                <Grid item xs={12}>
                  <Table className={classes.table}>
                    <TableHead>
                      <TableRow>
                        <TableCell>Index</TableCell>
                        <TableCell>Name</TableCell>

                      </TableRow>
                    </TableHead>
                    <TableBody>
                      {
                        _.isEmpty(this.props.businessList) ? (<TableRow></TableRow>)
                        : this.state.menu.map((item, index) => (

                            <TableRow hover key={index}
                              onClick={event => this.handleRowClick(event, item, index)}
                            >
                              <TableCell>{index + 1}</TableCell>
                              <TableCell>{item.krName}</TableCell>
                            </TableRow>

                        ))
                      }
                    </TableBody>
                  </Table>
                </Grid>
              </Grid>

            </DialogContent>
            <DialogActions>
              <Button color="primary" onClick={this.handleCloseSubDepartmentsDialog}>
                Close
              </Button>
            </DialogActions>
          </Dialog>

          <Dialog
            open={this.state.addMenuDialogOpen}
            onClose={this.handleCloseAddMenuDialog}
            aria-labelledby="alert-dialog-title"
            aria-describedby="alert-dialog-description"
          >
            <DialogTitle id="alert-dialog-title">
              <Grid container>
                <Grid item xs={6}>
                  New Menu
                </Grid>
                <Grid item xs={6}>
                  <div className={classes.buttonContainer}>
                    <Button color="secondary" disabled={!_.isNumber(this.state.menuIndex)} onClick={this.handleDeleteMenu}>
                      Delete
                    </Button>
                  </div>
                </Grid>
              </Grid>
            </DialogTitle>
            <DialogContent id="alert-dialog-description">
              <Grid container>
                <Grid item xs={6}>
                  <TextField fullWidth id="newMenuName" label="Name" margin="normal" name="newMenuName" onChange={this.handleChange} value={this.state.newMenuName} />
                </Grid>
                <Grid item xs={6}>
                  <TextField fullWidth id="newMenuPrice" label="Price" margin="normal" name="newMenuPrice" onChange={this.handleChange} value={this.state.newMenuPrice} />
                </Grid>
                <Grid item xs={6}>
                  <FormControl fullWidth >
                    <FormLabel component="label">Hot</FormLabel>
                    <RadioGroup
                      row
                      aria-label="Hot"
                      name="newMenuIsHot"
                      value={this.state.newMenuIsHot}
                      onChange={this.handleChange}
                    >
                      <FormControlLabel value="yes" control={<Radio />} label="Yes" />
                      <FormControlLabel value="no" control={<Radio />} label="No" />
                    </RadioGroup>
                  </FormControl>
                </Grid>
                <Grid item xs={6}>
                  <FormControl fullWidth >
                    <FormLabel component="label">New</FormLabel>
                    <RadioGroup
                      row
                      aria-label="Hot"
                      name="newMenuIsNew"
                      value={this.state.newMenuIsNew}
                      onChange={this.handleChange}
                    >
                      <FormControlLabel value='yes' control={<Radio />} label="Yes" />
                      <FormControlLabel value='no' checked control={<Radio />} label="No" />
                    </RadioGroup>
                  </FormControl>
                </Grid>
              </Grid>
            </DialogContent>
            <DialogActions>
              <Button color="primary" onClick={this.handleAddNewMenu} disabled={!(this.state.newMenuName && this.state.newMenuPrice)}>
                Save
              </Button>
              <Button color="primary" onClick={this.handleCloseAddMenuDialog}>
                Close
              </Button>
            </DialogActions>
          </Dialog>
        </div>
      </SettingContainer>
    );
  }
}

SingleBusinessPage.propTypes = {
  "classes": PropTypes.object.isRequired,
  "admin": PropTypes.object.isRequired,
  "categoriesList": PropTypes.array.isRequired,
  "tagsList": PropTypes.array.isRequired,
  "cities": PropTypes.array,
  "areas": PropTypes.array,
  "getCategoriesList": PropTypes.func.isRequired,
  "getTagsList": PropTypes.func.isRequired,
  "getCities": PropTypes.func.isRequired,
  "getAreas": PropTypes.func.isRequired,
};

const mapStateToProps = (state, ownProps) => {
  return {
    "admin": state.userReducer.user,
    "categoriesList": state.categoryReducer.categoriesList,
    "tagsList": state.tagReducer.tagsList,
    "cities": state.pcaReducer.cities,
    "areas": state.pcaReducer.areas,
    "businessList": state.businessReducer.businessList,
  };
};

export default connect(mapStateToProps, {
  getCategoriesList,
  getTagsList,
  getCities,
  getAreas,
  addBusiness
})(withStyles(styles)(SingleBusinessPage));
