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