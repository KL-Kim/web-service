import React, { Component } from 'react';
import { withStyles } from 'material-ui/styles';
import Grid from 'material-ui/Grid';
import Typography from 'material-ui/Typography';

import SettingContainer from './SettingContainer';
import StoryCard from '../utils/StoryCard';

const story = {
  id: '1',
  userId: '5a4ef8f5537cd042155581a3',
  businessId: '5a4ef8f5537cd042155581a3',
  businessName: 'SteakHouse',
  title: 'Tasting SteakHouse',
  content: 'Bla bla bla',
  commentCount: 10,
  good: 10,
  bad: 2
};

const styles = (theme) => ({

});

class StoryPage extends Component {
  render() {
    const { classes } = this.props;

    return (
      <SettingContainer>
        <Grid container>
              <Grid item xs={12}>
                <Typography type="display3" gutterBottom>
                  Story
                </Typography>
                <Grid container className={classes.root} spacing={16} justify="center" alignItems="center">
                  <Grid item xs={4}>
                    <StoryCard businessName={story.businessName}
                      title={story.title}
                      content={story.content}
                      commentCount={story.commentCount}
                      good={story.good}
                      bad={story.bad}
                    />
                  </Grid>
                  <Grid item xs={4}>
                    <StoryCard businessName={story.businessName}
                      title={story.title}
                      content={story.content}
                      commentCount={story.commentCount}
                      good={story.good}
                      bad={story.bad}
                    />
                  </Grid>
                  <Grid item xs={4}>
                    <StoryCard businessName={story.businessName}
                      title={story.title}
                      content={story.content}
                      commentCount={story.commentCount}
                      good={story.good}
                      bad={story.bad}
                    />
                  </Grid>
                </Grid>
              </Grid>
            </Grid>
      </SettingContainer>
    );
  }
}

export default withStyles(styles)(StoryPage);
