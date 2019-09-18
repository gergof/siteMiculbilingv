import React from 'react';
import PropTypes from 'prop-types';
import { compose, withState, withHandler } from 'recompose';
import { withStyles } from '@material-ui/core/styles';
import green from '@material-ui/core/colors/green';

import IconButton from '@material-ui/core/IconButton';
import Snackbar from '@material-ui/core/Snackbar';
import SnackbarContent from '@material-ui/core/SnackbarContent';

import ErrorIcon from '@material-ui/icons/Error';
import InfoIcon from '@material-ui/icons/Info';
import CloseIcon from '@material-ui/icons/Close';
import CheckCircleIcon from '@material-ui/icons/CheckCircle';

const styles = theme => ({
	snackbar: {
		margin: theme.spacing(2)
	},
	success: {
		backgroundColor: green[600]
	},
	error: {
		backgroundColor: theme.palette.error.dark
	},
	info: {
		backgroundColor: theme.palette.primary.main
	},
	message: {
		display: 'flex',
		alignItems: 'center'
	},
	icon: {
		width: '20px',
		height: '20px'
	}
});

export const Notification = ({ type, message, open, onClose, classes }) => {
	return (
		<Snackbar
			open={open}
			autoHideDuration={10000}
			onClose={onClose}
		>
			<SnackbarContent
				className={classes[type]}
				message={
					<span className={classes.message}>
						{type == 'success' ? (
							<CheckCircleIcon className={classes.icon} />
						) : type == 'error' ? (
							<ErrorIcon classes={classes.icon} />
						) : (
							<InfoIcon classes={classes.icon} />
						)}
						{message}
					</span>
				}
				action={[
					<IconButton key="close" color="inherit" onClick={onClose}>
						<CloseIcon className={classes.icon} />
					</IconButton>
				]}
			/>
		</Snackbar>
	);
};

export const enhancer = compose(
	withState('open', 'setOpen', true),
	withHandler({
		onClose: ({ setOpen, onClose }) => () => {
			setOpen(false);
			setTimeout(onClose, 500);
		}
	}),
	withStyles(styles)
);

export default enhancer(Notification);
