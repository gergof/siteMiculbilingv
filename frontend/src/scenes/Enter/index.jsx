import React from 'react';
import PropTypes from 'prop-types';
import { compose, lifecycle } from 'recompose';
import { connect } from 'react-redux';
import { withLang } from '../../lang';
import { withStyles } from '@material-ui/core/styles';
import { Formik, Field } from 'formik';
import { withRouter } from 'react-router-dom';
import { addNotification } from '../../data/duck';

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

import CheckIcon from '@material-ui/icons/Check';
import AddCircleOutlineIcon from '@material-ui/icons/AddCircleOutline';

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
	addButton:{ 
		margin: 'auto',
		display: 'flex',
		alignItems: 'center'
	},
	addIcon: {
		marginRight: theme.spacing(2)
	},
	addText: {
		paddingTop: theme.spacing(0.5)
	}
});

export const Enter = ({ lang, classes }) => {
	return (
		<Paper className={classes.container}>
			<Typography className={classes.title} variant="h6" gutterBottom>{lang.enteredStudents}</Typography>
			<Table>
				<TableHead>
					<TableRow>
						<TableCell>{lang.name}</TableCell>
						<TableCell>{lang.class}</TableCell>
					</TableRow>
				</TableHead>
				<TableBody>
				</TableBody>
			</Table>
			<Button className={classes.addButton} color="primary" onClick={() => console.log('new stud')}>
				<AddCircleOutlineIcon className={classes.addIcon}/>
				<Typography variant="button" className={classes.addText}>{lang.newStudent}</Typography>
			</Button>
		</Paper>
	)
};

export const enhancer = compose(
	connect(
		state => ({
			isLogged: !!state.app.auth.token
		}),
		dispatch => ({
			dispatchNotification: (type, message) =>
				dispatch(addNotification(type, message))
		})
	),
	withLang,
	lifecycle({
		componentDidMount() {
			if (!this.props.isLogged) {
				// redirect non-logged users to login page
				this.props.dispatchNotification('info', this.props.lang.entryNeedsLogin);
				this.props.history.push('/auth/login');
			}
		}
	}),
	withStyles(styles)
);

export default enhancer(Enter);
