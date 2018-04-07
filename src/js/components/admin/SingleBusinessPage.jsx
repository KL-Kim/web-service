import React, { Component } from 'react';
import PropTypes from 'prop-types';
import { connect } from 'react-redux';
import _ from 'lodash';
import validator from 'validator';
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
  DialogTitle,
} from 'material-ui/Dialog';
import IconButton from 'material-ui/IconButton';
import Search from 'material-ui-icons/Search';
import Chip from 'material-ui/Chip';
import { FormControl, FormControlLabel, FormLabel } from 'material-ui/Form';
import Radio, { RadioGroup } from 'material-ui/Radio';
import Switch from 'material-ui/Switch';
import { CircularProgress } from 'material-ui/Progress';

import SettingContainer from '../setting/SettingContainer';
import ConfirmationDialog from '../utils/ConfirmationDialog';
import Provinces from '../../constants/provinces';
import { getCategoriesList } from '../../actions/category.actions.js';
import { getTagsList } from '../../actions/tag.actions.js';
import { getCities, getAreas } from '../../actions/pca.actions';
import { getBusinessList, addBusiness, updateBusiness, deleteBusiness, getSingleBusiness } from '../../actions/business.actions';

// Mock image
import logo from '../../../css/logo.svg';

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
    "margin": theme.spacing.unit,
    "width": 150,
  },
  "progress": {
    margin: theme.spacing.unit * 2,
  },
  "chip": {
    margin: theme.spacing.unit,
  },
});

class SingleBusinessPage extends Component {
  constructor(props) {
    super(props);

    this.state = {
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
      thumbnailUri: {},
      imagesUri: [],
    }

    this.state._id = _.isUndefined(this.props.location.state.businessId) ? '' : this.props.location.state.businessId;
    this.state.newMenuName = '';
    this.state.newMenuPrice = '';
    this.state.newMenuIsHot = false;
    this.state.newMenuIsNew = false;
    this.state.subDepartmentsDialogOpen = false;
    this.state.addMenuDialogOpen = false;
    this.state.confirmationDialogOpen = false;
    this.state.isNew = false;
    this.state.menuIndex = null;
    this.state.search = '';

    this.handleSubmit = this.handleSubmit.bind(this);
    this.handleChange = this.handleChange.bind(this);
    this.handleOpenSubDepartmentsDialog = this.handleOpenSubDepartmentsDialog.bind(this);
    this.handleCloseSubDepartmentsDialog = this.handleCloseSubDepartmentsDialog.bind(this);
    this.handleOpenAddMenuDialog = this.handleOpenAddMenuDialog.bind(this);
    this.handleCloseAddMenuDialog = this.handleCloseAddMenuDialog.bind(this);
    this.handleAddNewMenu = this.handleAddNewMenu.bind(this);
    this.handleRowClick = this.handleRowClick.bind(this);
    this.handleDeleteMenu = this.handleDeleteMenu.bind(this);
    this.handleOpenConfimationDialog = this.handleOpenConfimationDialog.bind(this);
    this.handleSwitch = this.handleSwitch.bind(this);
    this.handleSubdepartmentsRowClick = this.handleSubdepartmentsRowClick.bind(this);
    this.handleDeleteSubdepartmentChip = this.handleDeleteSubdepartmentChip.bind(this);
    this.handleSearchBusiness = this.handleSearchBusiness.bind(this);
  }

  componentDidMount() {
    if (_.isEmpty(this.props.categoriesList)) {
      this.props.getCategoriesList();
    }

    if (_.isEmpty(this.props.tagsList)) {
      this.props.getTagsList();
    }

    if (this.state._id)
      this.props.getSingleBusiness(this.state._id).then(business => {
        this.setState({
          "_id": business._id || '',
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
          thumbnailUri: {
            "default": _.isEmpty(business.thumbnailUri) ? '' : business.thumbnailUri.default,
            "hd": _.isEmpty(business.thumbnailUri) ? '' : business.thumbnailUri.hd,
          },
          imagesUri: _.isEmpty(business.imagesUri) ? [] : business.imagesUri.slice(),
        });

        if (!_.isEmpty(business.tags)) {
          let tags = [];

          business.tags.map(tag => tags.push(tag.krName));

          this.setState({
            tags: tags.slice()
          });
        }
      });
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

  handleSearchBusiness() {
    console.log("Clicked Search");
  }

  handleSubdepartmentsRowClick(e, subdepartment) {
    const subDepartments = this.state.subDepartments.slice();
    subDepartments.push(subdepartment);

    this.setState({
      subDepartments: subDepartments.slice()
    });
  }

  handleDeleteSubdepartmentChip = data => e => {
    const subDepartments = this.state.subDepartments.slice();
    const index = this.state.subDepartments.indexOf(data);

    subDepartments.splice(index, 1);
    const newSubdepartments = subDepartments.slice();

    this.setState({
      subDepartments: newSubdepartments
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
      newMenuIsHot: false,
      newMenuIsNew: false,
    });
  }

  handleDeleteMenu() {
    if (_.isNumber(this.state.menuIndex)) this.state.menu.splice(this.state.menuIndex, 1);
    const newMenu = this.state.menu.slice();

    if (_.isEmpty(this.state.menuIndex)) {
      this.setState({
        addMenuDialogOpen: false,
        menuIndex: null,
        newMenuName: '',
        newMenuPrice: '',
        newMenuIsHot: false,
        newMenuIsNew: false,
      });
    } else {
      this.setState({
        addMenuDialogOpen: false,
        menuIndex: null,
        menu: newMenu,
        newMenuName: '',
        newMenuPrice: '',
        newMenuIsHot: false,
        newMenuIsNew: false,
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

  handleOpenConfimationDialog() {
    this.setState({
      confirmationDialogOpen: true
    });
  }

  handleSwitch = name => e => {
    this.setState({
      [name]: e.target.checked
    });
  }

  handleSubmit(e) {
    if (this.state.krName && this.state.cnName && this.state.enName && this.state.tel && this.state.category._id) {
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
            return item.krName === tag
          });

          if (index > -1) {
            tags.push(this.props.tagsList[index]._id);
          }

          return index;
        })

        data.tags = tags.slice();
      }

      if (this.state.subDepartments) {
        let subDepartments = [];

        this.state.subDepartments.map(item => {
          subDepartments.push(item._id)
        })

        data.subDepartments = subDepartments.slice();
      }

      if (this.state._id) {
        data._id = this.state._id;
        this.props.updateBusiness(data);
      } else {
        this.props.addBusiness(data);
      }

    }
  }

  render() {
    const { classes, cities, areas, isFetching } = this.props;

    return (
      <SettingContainer>
        {isFetching ? (<CircularProgress className={classes.progress} size={50} />) :
          (<div>
            <Grid container spacing={24} alignItems="center" className={classes.container}>
              <Grid item xs={6}>
                <Typography type="display1" gutterBottom>{this.state.cnName + ' - ' + this.state.krName}</Typography>
              </Grid>

              <Grid item xs={6}>
                <div className={classes.buttonContainer}>
                  <Button color="secondary" className={classes.button}
                    onClick={this.handleOpenConfimationDialog}
                    disabled={_.isEmpty(this.state._id)}
                  >
                    Delete
                  </Button>
                  <Button raised color="primary" className={classes.button}
                    onClick={this.handleSubmit}
                    disabled={!(
                      this.state.krName
                      && this.state.cnName
                      && this.state.enName
                      && this.state.tel)
                      || _.isEmpty(this.state.category._id)
                    }
                  >
                    {this.state._id ? 'Update' : 'Save'}
                  </Button>
                </div>
              </Grid>
            </Grid>

            <Grid container spacing={24} className={classes.container}>
              <Grid item xs={6} cla>
                <Paper>
                  <img src={logo} alt="Main" />
                </Paper>
              </Grid>
              <Grid item xs={6}>
                <Grid container spacing={16}>
                  <Grid item xs={3}>
                    <Paper>
                      <img src={logo} alt="photo1" />
                    </Paper>
                  </Grid>
                  <Grid item xs={3}>
                    <Paper>
                      <img src={logo} alt="photo2" />
                    </Paper>
                  </Grid>
                  <Grid item xs={3}>
                    <Paper>
                      <img src={logo} alt="photo2" />
                    </Paper>
                  </Grid>
                  <Grid item xs={3}>
                    <Paper>
                      <img src={logo} alt="photo2" />
                    </Paper>
                  </Grid>
                  <Grid item xs={3}>
                    <Paper>
                      <img src={logo} alt="photo2" />
                    </Paper>
                  </Grid>
                </Grid>
              </Grid>
            </Grid>

            <Grid container spacing={24} alignItems="center">
              <Grid item xs={3}>
                <Paper className={classes.paper}>
                  <FormControl fullWidth>
                    <InputLabel htmlFor="category" required>Category</InputLabel>
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
                        <Button raised color="primary" onClick={this.handleOpenSubDepartmentsDialog}>Add</Button>
                      </div>
                    </Grid>

                    <Grid item xs={12}>
                      {
                        this.state.subDepartments.map((data, index) => (
                          <Chip
                            key={index}
                            label={data.krName}
                            onDelete={this.handleDeleteSubdepartmentChip(data)}
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
                        error={!_.toNumber(this.state.geo.lat)}
                        value={this.state.geo.lat}
                        name="lat"
                        onChange={this.handleChange}
                      />
                    </Grid>

                    <Grid item xs={12}>
                      <TextField fullWidth id="long" label="Longtitude"  margin="normal"
                        error={!_.toNumber(this.state.geo.lat)}
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
                        name="sun"
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
                  <TextField fullWidth multiline id="description" label="Description"  margin="normal"
                    name="description"
                    value={this.state.description}
                    onChange={this.handleChange}
                  />
                </Paper>
              </Grid>

              <Grid item xs={6}>
                <Paper className={classes.paper}>
                  <Typography type="title">Event</Typography>
                  <TextField fullWidth multiline id="event" label="Event"  margin="normal"
                    name="event"
                    value={this.state.event}
                    onChange={this.handleChange}
                  />
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
                            <TableCell>{item.hot ? 'Yes' : 'No'}</TableCell>
                            <TableCell>{item.new ? 'Yes' : 'No'}</TableCell>
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

            <Dialog fullWidth
              open={this.state.subDepartmentsDialogOpen}
              onClose={this.handleCloseSubDepartmentsDialog}
              aria-labelledby="sd-dialog-title"
              aria-describedby="sd-dialog-description1"

            >
              <DialogTitle id="sd-dialog-title" >
                <Grid container justify="space-between" alignItems="center">
                  <Grid item xs={8}>
                    Departments
                  </Grid>
                  <Grid item xs={4}>
                    <form onSubmit={this.handleSearchBusiness}>
                      <FormControl fullWidth margin="none">
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
                                onClick={this.handleSearchBusiness}
                              >
                                <Search />
                              </IconButton>
                            </InputAdornment>
                          }
                        />
                      </FormControl>
                    </form>
                  </Grid>
                </Grid>
              </DialogTitle>
              <DialogContent id="sd-dialog-description">
                <Grid container>
                  <Grid item xs={12}>
                    <Table className={classes.table}>
                      <TableHead>
                        <TableRow>
                          <TableCell>Index</TableCell>
                          <TableCell>한국어</TableCell>
                          <TableCell>中文名</TableCell>
                        </TableRow>
                      </TableHead>
                      <TableBody>
                        {
                          _.isEmpty(this.props.businessList) ? (<TableRow></TableRow>)
                          : this.props.businessList.map((item, index) => (

                              <TableRow hover key={index}
                                onClick={event => this.handleSubdepartmentsRowClick(event, item)}
                              >
                                <TableCell>{index + 1}</TableCell>
                                <TableCell>{item.krName}</TableCell>
                                <TableCell>{item.cnName}</TableCell>
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

            <Dialog fullWidth
              open={this.state.addMenuDialogOpen}
              onClose={this.handleCloseAddMenuDialog}
              aria-labelledby="menu-dialog-title"
              aria-describedby="menu-dialog-description"
            >
              <DialogTitle id="menu-dialog-title">
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
              <DialogContent id="menu-dialog-description">
                <Grid container spacing={40}>
                  <Grid item xs={6}>
                    <TextField fullWidth id="newMenuName" label="Name" margin="normal" name="newMenuName" onChange={this.handleChange} value={this.state.newMenuName} />
                  </Grid>
                  <Grid item xs={6}>
                    <TextField fullWidth id="newMenuPrice" label="Price" margin="normal" name="newMenuPrice" onChange={this.handleChange} value={this.state.newMenuPrice} />
                  </Grid>
                  <Grid item xs={6}>
                    <FormControl fullWidth >
                      <FormLabel component="label">Hot</FormLabel>
                      <Switch
                        color="primary"
                        checked={this.state.newMenuIsHot}
                        onChange={this.handleSwitch('newMenuIsHot')}
                        value="newMenuIsHot"
                        />
                    </FormControl>
                  </Grid>
                  <Grid item xs={6}>
                    <FormControl fullWidth >
                      <FormLabel component="label">New</FormLabel>
                        <Switch
                          color="primary"
                          checked={this.state.newMenuIsNew}
                          onChange={this.handleSwitch('newMenuIsNew')}
                          value="newMenuIsNew"
                          />
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

            <ConfirmationDialog
              open={this.state.confirmationDialogOpen}
              operation={this.props.deleteBusiness}
              params={this.state._id}
              title="Warning"
              content="Are your sure to delete the business?"
              goBack={true}
              />
          </div>)}
      </SettingContainer>
    );
  }
}

SingleBusinessPage.propTypes = {
  "classes": PropTypes.object.isRequired,
  "admin": PropTypes.object.isRequired,
  "businessList": PropTypes.array.isRequired,
  "categoriesList": PropTypes.array.isRequired,
  "tagsList": PropTypes.array.isRequired,
  "cities": PropTypes.array,
  "areas": PropTypes.array,
  "getBusinessList": PropTypes.func.isRequired,
  "getCategoriesList": PropTypes.func.isRequired,
  "getTagsList": PropTypes.func.isRequired,
  "getCities": PropTypes.func.isRequired,
  "getAreas": PropTypes.func.isRequired,
  "getSingleBusiness": PropTypes.func.isRequired,
  "addBusiness": PropTypes.func.isRequired,
  "updateBusiness": PropTypes.func.isRequired,
  "deleteBusiness": PropTypes.func.isRequired,
};

const mapStateToProps = (state, ownProps) => {
  return {
    "admin": state.userReducer.user,
    "categoriesList": state.categoryReducer.categoriesList,
    "tagsList": state.tagReducer.tagsList,
    "cities": state.pcaReducer.cities,
    "areas": state.pcaReducer.areas,
    "businessList": state.businessReducer.businessList,
    "isFetching": state.businessReducer.isFetching,
  };
};

export default connect(mapStateToProps, {
  getBusinessList,
  getCategoriesList,
  getTagsList,
  getCities,
  getAreas,
  getSingleBusiness,
  addBusiness,
  updateBusiness,
  deleteBusiness,
})(withStyles(styles)(SingleBusinessPage));
