import React from 'react';
import PropTypes from 'prop-types';
import { compose, lifecycle, withState, withHandlers } from 'recompose';
import { connect } from 'react-redux';
import { withLang } from '../../lang';
import { withStyles } from '@material-ui/core/styles';
import { Formik, Field } from 'formik';
import { withRouter } from 'react-router-dom';
import { addNotification, fetchSeasons } from '../../data/duck';
import { fetchEntries } from './data/duck';

import Paper from '@material-ui/core/Paper';
import Typography from '@material-ui/core/Typography';
import Table from '@material-ui/core/Table';
import TableHead from '@material-ui/core/TableHead';
import TableBody from '@material-ui/core/TableBody';
import TableRow from '@material-ui/core/TableRow';
import TableCell from '@material-ui/core/TableCell';
import Button from '@material-ui/core/Button';
import TextField from '@material-ui/core/TextField';
import IconButton from '@material-ui/core/IconButton';
import Grid from '@material-ui/core/Grid';
import CircularProgress from '@material-ui/core/CircularProgress';

import CheckIcon from '@material-ui/icons/Check';
import AddCircleOutlineIcon from '@material-ui/icons/AddCircleOutline';

import EnterField from './components/EnterField';

const styles = theme => ({
	container: {
		width: '80%',
		margin: 'auto',
		padding: theme.spacing(3)
	},
	title: {
		borderBottom: '1px solid',
		borderBottomColor: theme.palette.primary.main,
		marginBottom: theme.spacing(3)
	},
	addButton: {
		margin: 'auto',
		display: 'flex',
		alignItems: 'center'
	},
	addIcon: {
		marginRight: theme.spacing(2)
	},
	addText: {
		paddingTop: theme.spacing(0.5)
	},
	grid: {
		alignItems: 'center',
		justifyContent: 'space-between'
	}
});

export const Enter = ({
	entries,
	isAdding,
	onAddEntryClick,
	onEntryAddDone,
	lang,
	classes
}) => {
	return (
		<Paper className={classes.container}>
			<Typography className={classes.title} variant="h6" gutterBottom>
				{lang.enteredStudents}
			</Typography>
			<Table>
				<TableHead>
					<TableRow>
						<TableCell>{lang.name}</TableCell>
						<TableCell>{lang.class}</TableCell>
					</TableRow>
				</TableHead>
				<TableBody>
					{entries.map(entry => (
						<TableRow key={entry.id}>
							<TableCell>{entry.name}</TableCell>
							<TableCell>
								<Grid container className={classes.grid}>
									<Grid item>{entry.class}</Grid>
									{entry.loading ? (
										<Grid item>
											<CircularProgress size={14} />
										</Grid>
									) : null}
								</Grid>
							</TableCell>
						</TableRow>
					))}
					{isAdding ? <EnterField onDone={onEntryAddDone} /> : null}
				</TableBody>
			</Table>
			{entries.length < process.env.MAX_ENTRIES && !isAdding ? (
				<Button
					className={classes.addButton}
					color="primary"
					onClick={onAddEntryClick}
				>
					<AddCircleOutlineIcon className={classes.addIcon} />
					<Typography variant="button" className={classes.addText}>
						{lang.newStudent}
					</Typography>
				</Button>
			) : null}
		</Paper>
	);
};

export const enhancer = compose(
	withState('isAdding', 'setIsAdding', false),
	connect(
		state => ({
			isLogged: !!state.app.auth.token,
			entries: state.enter.entries.list.map(id => state.enter.entries.store[id])
		}),
		dispatch => ({
			dispatchNotification: (type, message) =>
				dispatch(addNotification(type, message)),
			fetchSeasons: () => dispatch(fetchSeasons()),
			fetchEntries: () => dispatch(fetchEntries())
		})
	),
	withLang,
	withHandlers({
		onAddEntryClick: ({ setIsAdding }) => () => {
			setIsAdding(true);
		},
		onEntryAddDone: ({ setIsAdding }) => () => {
			setIsAdding(false);
		}
	}),
	lifecycle({
		componentDidMount() {
			if (!this.props.isLogged) {
				// redirect non-logged users to login page
				this.props.dispatchNotification(
					'info',
					this.props.lang.entryNeedsLogin
				);
				this.props.history.push('/auth/login');
			} else {
				this.props.fetchSeasons();
				this.props.fetchEntries();
			}
		}
	}),
	withStyles(styles)
);

export default enhancer(Enter);
