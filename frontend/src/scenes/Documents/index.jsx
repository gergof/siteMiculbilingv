import React from 'react';
import PropTypes from 'prop-types';
import { compose, lifecycle } from 'recompose';
import { connect } from 'react-redux';
import { fetchSeasons, addNotification } from '../../data/duck';
import { fetchDocuments } from './data/duck';
import { withRouter } from 'react-router-dom';
import { getModel } from '../../data/api';
import { withLang } from '../../lang';

import SeasonGroup from '../../components/SeasonGroup';
import DocumentList from './components/DocumentList';
import Document from './components/Document';

export const Documents = ({ documents }) => {
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

Documents.propTypes = {
	documents: PropTypes.array
};

export const enhancer = compose(
	withRouter,
	connect(
		state => ({
			isLogged: !!state.app.auth.token,
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
			},
			dispatchNotification: (type, message) =>
				dispatch(addNotification(type, message))
		})
	),
	withLang,
	lifecycle({
		componentDidMount() {
			this.props.fetchDocuments();

			if (this.props.match.params.id) {
				getModel(
					'documents',
					this.props.match.params.id,
					null,
					!this.props.isLogged
				).then(
					res => {
						window.location.href = res.data.downloadLink;
						setTimeout(() => {
							this.props.history.goBack();
						}, 500);
					},
					() => {
						this.props.dispatchNotification('error', this.props.lang.error404);
						this.props.history.goBack();
					}
				);
			}
		}
	})
);

export default enhancer(Documents);
