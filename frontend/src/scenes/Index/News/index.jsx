import React from 'react';
import PropTypes from 'prop-types';
import { compose, lifecycle, withHandlers, withProps } from 'recompose';
import { connect } from 'react-redux';
import { withLang } from '../../../lang';
import { withStyles } from '@material-ui/core/styles';
import { withRouter } from 'react-router-dom';
import queryString from 'query-string';

import { fetchNews, markAsRead } from '../data/duck';
import { fetchSeasons } from '../../../data/duck';

import Typography from '@material-ui/core/Typography';

import PieceOfNews from './PieceOfNews';

const styles = theme => ({
	title: {
		borderBottom: '1px solid',
		borderBottomColor: theme.palette.primary.main,
		marginBottom: theme.spacing(3)
	}
});

export const News = ({ news, highlight, markAsRead, lang, classes }) => {
	return (
		<div>
			<Typography className={classes.title} variant="h3">
				{lang.news}
			</Typography>
			<div>
				{news.map(news => (
					<PieceOfNews
						key={news.id}
						news={news}
						markAsRead={markAsRead}
						highlight={news.id == highlight}
					/>
				))}
			</div>
		</div>
	);
};

News.propTypes = {
	news: PropTypes.array,
	highlight: PropTypes.string,
	markAsRead: PropTypes.func,
	lang: PropTypes.object,
	classes: PropTypes.object
};

export const enhance = compose(
	withRouter,
	connect(
		state => ({
			news: state.index.news.list.map(id => ({
				...state.index.news.store[id],
				target: state.index.targets.store[state.index.targets.byNews[id]]
			}))
		}),
		dispatch => ({
			fetchNews: () => dispatch(fetchNews()),
			markAsRead: (id, read = true) => dispatch(markAsRead(id, read)),
			fetchSeasons: () => dispatch(fetchSeasons())
		})
	),
	withProps(({ location }) => {
		const queryParams = queryString.parse(location.search);

		return {
			highlight: queryParams.highlight
		};
	}),
	lifecycle({
		componentDidMount() {
			this.props.fetchNews();
			this.props.fetchSeasons();
		}
	}),
	withHandlers({
		markAsRead: ({ markAsRead }) => (id, read = true) => {
			markAsRead(id, read);
		}
	}),
	withLang,
	withStyles(styles)
);

export default enhance(News);
