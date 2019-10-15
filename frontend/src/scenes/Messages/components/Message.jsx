import React from 'react';
import PropTypes from 'prop-types';
import { compose, withHandlers, lifecycle, withProps } from 'recompose';
import { withLang } from '../../../lang';
import { withStyles } from '@material-ui/core/styles';
import { withRouter } from 'react-router-dom';
import { connect } from 'react-redux';
import { fetchMessages, fetchSentMessages } from '../data/duck';
import { addNotification } from '../../../data/duck';
import classNames from 'classnames';
import renderHTML from 'react-render-html';
import sanitizeHTML from 'sanitize-html';

import Slide from '@material-ui/core/Slide';
import Paper from '@material-ui/core/Paper';
import IconButton from '@material-ui/core/IconButton';
import Divider from '@material-ui/core/Divider';
import Typography from '@material-ui/core/Typography';

import ArrowBackIcon from '@material-ui/icons/ArrowBack';

import Loading from '../../../components/Loading';

const styles = theme => ({
	outerContainer: {
		position: 'relative'
	},
	container: {
		width: '50%',
		padding: theme.spacing(3),
		margin: 'auto',
		minWidth: '800px'
	},
	loadingMask: {
		filter: 'blur(3px)'
	},
	meta: {
		width: '30%',
		marginLeft: '70%',
		padding: theme.spacing(1)
	},
	message: {
		marginTop: theme.spacing(3)
	}
});

export const Message = ({ loading, message, onBackClick, lang, classes }) => {
	return (
		<Slide in={true} direction="left">
			<div className={classes.outerContainer}>
				<Paper
					className={classNames({
						[classes.container]: true,
						[classes.loadingMask]: loading
					})}
				>
					<IconButton onClick={onBackClick}>
						<ArrowBackIcon />
					</IconButton>
					<Divider />
					<div className={classes.meta}>
						<Typography variant="body2">
							{lang.sender}: {(message.user && message.user.name) || ''}
						</Typography>
						<Typography variant="body2">
							{lang.recipient}:{' '}
							{(message.recipient && message.recipient.name) || ''}
						</Typography>
						<Typography variant="body2">
							{lang.sentOn}: {message.created_at || ''}
						</Typography>
					</div>
					<div className={classes.message}>
						{renderHTML(sanitizeHTML(message.message || ''))}
					</div>
				</Paper>
				{loading ? <Loading /> : null}
			</div>
		</Slide>
	);
};

Message.propTypes = {
	loading: PropTypes.bool,
	message: PropTypes.object,
	onBackClick: PropTypes.func,
	lang: PropTypes.object,
	classes: PropTypes.object
};

export const enhancer = compose(
	withRouter,
	connect(
		state => ({
			messages: state.messages.messages,
			loading:
				state.messages.messages.received.loading ||
				state.messages.messages.sent.loading
		}),
		dispatch => ({
			fetchMessages: () => dispatch(fetchMessages()),
			fetchSentMessages: () => dispatch(fetchSentMessages()),
			dispatchNotification: (type, message) =>
				dispatch(addNotification(type, message))
		})
	),
	withProps(({ messages, match }) => {
		return {
			message:
				messages.received.store[match.params.id] ||
				messages.sent.store[match.params.id] ||
				{}
		};
	}),
	withHandlers({
		onBackClick: ({ history }) => () => {
			history.goBack();
		}
	}),
	withLang,
	lifecycle({
		componentDidMount() {
			this.props.fetchMessages();
			this.props.fetchSentMessages();
		},
		componentDidUpdate(prevProps) {
			if (prevProps.loading == true) {
				if (this.props.loading == false && !this.props.message.message) {
					this.props.history.push('/messages');
					this.props.dispatchNotification(
						'error',
						this.props.lang.messageNotFound
					);
				}
			}
		}
	}),
	withStyles(styles)
);

export default enhancer(Message);
