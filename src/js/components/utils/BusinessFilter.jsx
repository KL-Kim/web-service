import React, { Component } from 'react';
import { withStyles } from 'material-ui/styles';
import Grid from 'material-ui/Grid';
import Typography from 'material-ui/Typography';
import Button from 'material-ui/Button';

const categories = [
  'Restaurant',
  'KTV',
  'Massage',
  'Hospital',
  'Hair',
  'Real Estate',
  'Shopping Mall',
  'Night Bar'
];

const district = [
  'Xuanwu',
  'Jiangning',
  'Qinhuai',
  'Qixia'
]

const styles = theme => ({});

class BusinessFilter extends Component {
  render() {
    const categoryList = categories.map((i) => (
      <Button dense color="primary" key={i}>{i}</Button>
    ));

    const districtList = district.map((i) => (
      <Button dense color="primary" key={i}>{i}</Button>
    ));

    return (
      <Grid container spacing={8}>
        <Grid item xs={12}>
          <Typography type="title">Category:</Typography>
          {categoryList}
          <Button color="primary">More</Button>
        </Grid>
        <Grid item xs={12}>
          <Typography type="title">District:</Typography>
          {districtList}
          <Button color="primary">More</Button>
        </Grid>
        <Grid item xs={12}>
          <Typography type="title">Filter:</Typography>
          <Button color="primary">Filter1</Button>
          <Button color="primary">Filter2</Button>
          <Button color="primary">Filter3</Button>
          <Button color="primary">Filter4</Button>
          <Button color="primary">Filter1</Button>
          <Button color="primary">Filter2</Button>
          <Button color="primary">Filter3</Button>
          <Button color="primary">Filter4</Button>
          <Button color="primary">More</Button>
        </Grid>
      </Grid>
    );
  }
}

export default withStyles(styles)(BusinessFilter);
