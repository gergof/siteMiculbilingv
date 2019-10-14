import React from 'react';
import PropTypes from 'prop-types';
import { compose, withHandlers } from 'recompose';
import { connect } from 'react-redux';
import { withStyles } from '@material-ui/core/styles';
import { deleteNotification } from '../data/duck';
import Notification from './Notification';

const styles = theme => ({
	container: {
		marginTop: theme.spacing(8),
		position: 'fixed',
		top: 0,
		right: 0,
		overflow: 'visible',
		display: 'flex',
		flexDirection: 'column',
		zIndex: theme.zIndex.drawer + 2
	}
});

export const NotificationList = ({
	notifications,
	onNotificationClose,
	classes
}) => {
	return (
		<div className={classes.container}>
			{notifications.map(notification => (
				<Notification
					key={notification.id}
					id={notification.id}
					type={notification.type}
					message={notification.message}
					onClose={() => onNotificationClose(notification.id)}
				/>
			))}
		</div>
	);
};

NotificationList.propTypes = {
	notifications: PropTypes.array,
	onNotificationClose: PropTypes.func,
	classes: PropTypes.object
};

export const enhancer = compose(
	connect(
		state => ({
			notifications: state.app.notifications
		}),
		dispatch => ({
			deleteNotification: id => dispatch(deleteNotification(id))
		})
	),
	withHandlers({
		onNotificationClose: ({ deleteNotification }) => id => {
			deleteNotification(id);
		}
	}),
	withStyles(styles)
);

export default enhancer(NotificationList);
