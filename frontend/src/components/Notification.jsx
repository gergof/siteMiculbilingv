import React from 'react';
import PropTypes from 'prop-types';
import { compose, withState, withHandlers } from 'recompose';
import { withStyles } from '@material-ui/core/styles';
import green from '@material-ui/core/colors/green';

import IconButton from '@material-ui/core/IconButton';
import Snackbar from '@material-ui/core/Snackbar';
import SnackbarContent from '@material-ui/core/SnackbarContent';
import Collapse from '@material-ui/core/Collapse';

import ErrorIcon from '@material-ui/icons/Error';
import InfoIcon from '@material-ui/icons/Info';
import CloseIcon from '@material-ui/icons/Close';
import CheckCircleIcon from '@material-ui/icons/CheckCircle';

const styles = theme => ({
	snackbar: {
		margin: theme.spacing(1),
		position: 'static',
		left: 0,
		transform: 'none',
		alignSelf: 'flex-end'
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
	messageText: {
		paddingLeft: '5px'
	},
	icon: {
		width: '20px',
		height: '20px'
	}
});

export const Notification = ({ id, type, message, open, onClose, classes }) => {
	return (
		<Snackbar
			key={id}
			open={open}
			autoHideDuration={10000}
			onClose={onClose}
			classes={{ root: classes.snackbar }}
			TransitionComponent={Collapse}
		>
			<SnackbarContent
				className={classes[type]}
				message={
					<span className={classes.message}>
						{type == 'success' ? (
							<CheckCircleIcon className={classes.icon} />
						) : type == 'error' ? (
							<ErrorIcon className={classes.icon} />
						) : (
							<InfoIcon className={classes.icon} />
						)}
						<span className={classes.messageText}>{message}</span>
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

Notification.propTypes = {
	id: PropTypes.string,
	type: PropTypes.string,
	message: PropTypes.string,
	open: PropTypes.bool,
	onClose: PropTypes.func,
	classes: PropTypes.object
};

export const enhancer = compose(
	withState('open', 'setOpen', true),
	withHandlers({
		onClose: ({ setOpen, onClose }) => (e, reason) => {
			if (reason == 'clickaway') {
				return;
			}
			setOpen(false);
			setTimeout(onClose, 500);
		}
	}),
	withStyles(styles)
);

export default enhancer(Notification);
