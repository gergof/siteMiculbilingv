import React from 'react';
import PropTypes from 'prop-types';
import { compose, lifecycle } from 'recompose';
import { withLang } from '../../lang';
import { withStyles } from '@material-ui/core/styles';
import { connect } from 'react-redux';
import { fetchSeasons } from '../../data/duck';
import { fetchDocuments } from './data/duck';

import SeasonGroup from '../../components/SeasonGroup';
import DocumentList from './components/DocumentList';
import Document from './components/Document';

const styles = theme => ({});

export const Documents = ({ documents, lang, classes }) => {
	return (
		<div>
			{documents.map(docs => (
				<SeasonGroup
					key={docs.id}
					season={docs}
					childKey="documents"
					wrapper={DocumentList}
					component={Document}
				/>
			))}
		</div>
	);
};

Documents.propTypes = {};

export const enhancer = compose(
	connect(
		state => ({
			documents: state.app.seasons.list.map(id => ({
				...state.app.seasons.store[id],
				documents: state.documents.documents.bySeason[id]
					? state.documents.documents.bySeason[id].map(
							id => state.documents.documents.store[id]
					  )
					: []
			}))
		}),
		dispatch => ({
			fetchDocuments: () => {
				dispatch(fetchSeasons());
				dispatch(fetchDocuments());
			}
		})
	),
	lifecycle({
		componentDidMount() {
			this.props.fetchDocuments();
		}
	}),
	withLang,
	withStyles(styles)
);

export default enhancer(Documents);
