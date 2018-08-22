import React, { Component } from 'react';
import PropTypes from 'prop-types';
import { Link } from 'react-router-dom';

// Material UI Components
import { withStyles } from '@material-ui/core/styles'
import Hidden from '@material-ui/core/Hidden';
import Grid from '@material-ui/core/Grid';
import Typography from '@material-ui/core/Typography';
import Button from '@material-ui/core/Button';

const styles = (theme) => ({
  footer: {
    padding: theme.spacing.unit,
    position: 'absolute',
    bottom: 0,
    left: 0,
    right: 0,
    backgroundColor: theme.palette.background.paper,
  },
  container: {
    maxWidth: 960,
    width: '100%',
    margin: 'auto',
  }
});

class Footer extends Component{
  render() {
    const { classes } = this.props;

    return (
      <Hidden xsDown>
        <footer className={classes.footer}>
          <Grid container justify="space-between" alignItems="center" className={classes.container}>
            <Grid item>
              <Grid container>
                <Grid item>
                  <Link to="/about">
                    <Button>
                      About us
                    </Button>
                  </Link>
                </Grid>
                <Grid item>
                  <Link to="/license">
                    <Button>
                      Licenses
                    </Button>
                  </Link>
                </Grid>
                <Grid item>
                  <Link to="/terms-policy">
                    <Button>
                      Terms & Policy
                    </Button>
                  </Link>
                </Grid>

                <Grid item>
                  <Link to="/blog">
                    <Button>
                      Blog
                    </Button>
                  </Link>
                </Grid>
              </Grid>
            </Grid>

            <Grid item>
              <Typography variant="caption" align="right">
                Copyright 2018 iKoreaTown
              </Typography>
            </Grid>
          </Grid>

          {
            // <Grid container>
            //   <Grid item>
            //     <Link to="/verify/123">
            //       <Button>
            //         Verify
            //       </Button>
            //     </Link>
            //   </Grid>

            //   <Grid item>
            //     <Link to="/change-password/123">
            //       <Button>
            //         Change Password
            //       </Button>
            //     </Link>
            //   </Grid>

            //  <Grid item>
            //     <Link to="/forget-password">
            //       <Button>
            //         Forget Password
            //       </Button>
            //     </Link>
            //   </Grid>
            // </Grid>
          }

        </footer>
      </Hidden>
    );
  }
}

Footer.propTypes = {
  classes: PropTypes.object.isRequired
};

export default withStyles(styles)(Footer);
