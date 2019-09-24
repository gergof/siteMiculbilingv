import React from 'react';
import PropTypes from 'prop-types';
import { compose, withHandlers } from 'recompose';
import renderHTML from 'react-render-html';
import { withLang } from '../../../lang';
import { withStyles } from '@material-ui/core/styles';
import classnames from 'classnames';

import Paper from '@material-ui/core/Paper';
import Typography from '@material-ui/core/Typography';
import IconButton from '@material-ui/core/IconButton';
import Grid from '@material-ui/core/Grid';
import CircularProgress from '@material-ui/core/CircularProgress';
import Tooltip from '@material-ui/core/Tooltip';

import DraftsIcon from '@material-ui/icons/Drafts';
import MarkunreadIcon from '@material-ui/icons/Markunread';

const styles = theme => ({
	container: {
		width: '70%',
		minWidth: '600px',
		margin: 'auto',
		marginBottom: theme.spacing(3),
		padding: theme.spacing(3)
	},
	header: {
		borderBottom: '1px solid',
		borderBottomColor: theme.palette.primary.accent,
		alignItems: 'center',
		justifyContent: 'space-between',
		marginBottom: theme.spacing(2)
	},
	headerContent: {
		flexGrow: 1
	},
	headerActions: {},
	unread: {
		background: '#FFFFDF'
	}
});

export const PieceOfNews = ({ news, onToggleReadClick, lang, classes }) => {
	return (
		<Paper
			className={classnames({
				[classes.container]: true,
				[classes.unread]: news.is_public == 0 && news.target.is_read == 0
			})}
		>
			<Grid container className={classes.header}>
				<Grid item className={classes.headerContent}>
					<Typography variant="subtitle1">{news.title}</Typography>
					<Typography variant="caption">{news.updated_at}</Typography>
				</Grid>
				{news.is_public == 0 ? (
					<Grid item className={classes.headerActions}>
						{news.target.loading ? (
							<CircularProgress />
						) : (
							<Tooltip
								enterDelay={500}
								placement="top"
								title={
									news.target.is_read == 1 ? lang.markAsRead : lang.markAsUnread
								}
							>
								<IconButton onClick={onToggleReadClick}>
									{news.target.is_read == 1 ? (
										<DraftsIcon />
									) : (
										<MarkunreadIcon />
									)}
								</IconButton>
							</Tooltip>
						)}
					</Grid>
				) : null}
			</Grid>
			<div>{renderHTML(news.message)}</div>
		</Paper>
	);
};

PieceOfNews.propTypes = {
	news: PropTypes.object,
	onToggleReadClick: PropTypes.func,
	lang: PropTypes.object,
	classes: PropTypes.object
};

export const enhance = compose(
	withHandlers({
		onToggleReadClick: ({ news, markAsRead }) => () => {
			markAsRead(news.target.id, news.target.is_read == 0);
		}
	}),
	withLang,
	withStyles(styles)
);

export default enhance(PieceOfNews);
