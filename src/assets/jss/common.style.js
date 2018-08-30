// ##############################
// Variables - Styles that are used on more than one component
// #############################

export const root = theme => ({
	maxWidth: 976,
	margin: 'auto',
	marginTop: theme.spacing.unit * 8,
	marginBottom: theme.spacing.unit * 8,
	paddingLeft: theme.spacing.unit,
	paddingRight: theme.spacing.unit,
	paddingTop: theme.spacing.unit * 4,
	[theme.breakpoints.down('xs')]: {
		marginTop: theme.spacing.unit * 7,
		marginBottom: theme.spacing.unit * 7,
		paddingTop: theme.spacing.unit * 2,
		
	}
});

export const chipBar = theme => ({
	marginTop: theme.spacing.unit,
    marginBottom: theme.spacing.unit,
});

export const chip = theme => ({
	marginRight: theme.spacing.unit,
    paddingTop: theme.spacing.unit,
    paddingBottom: theme.spacing.unit,
    paddingLeft: theme.spacing.unit * 3,
    paddingRight: theme.spacing.unit * 3,
    fontSize: theme.typography.pxToRem(16),
    width: 'auto',
    display: 'inline-block',
});