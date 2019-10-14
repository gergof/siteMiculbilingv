import React from 'react';
import PropTypes from 'prop-types';
import { compose, withHandlers } from 'recompose';
import { withLang } from '../../../lang';
import { getModel } from '../../../data/api';
import { connect } from 'react-redux';

import TableRow from '@material-ui/core/TableRow';
import TableCell from '@material-ui/core/TableCell';
import Button from '@material-ui/core/Button';

export const Document = ({ data, onDownloadClick, lang }) => {
	return (
		<TableRow>
			<TableCell>{data.name}</TableCell>
			<TableCell>
				<Button variant="contained" color="primary" onClick={onDownloadClick}>
					{lang.download}
				</Button>
			</TableCell>
		</TableRow>
	);
};

Document.propTypes = {
	data: PropTypes.object,
	onDownloadClick: PropTypes.func,
	lang: PropTypes.object
};

export const enhancer = compose(
	connect(state => ({
		isLogged: !!state.app.auth.token
	})),
	withHandlers({
		onDownloadClick: ({ data, isLogged }) => () => {
			getModel('documents', data.id, null, !isLogged).then(res => {
				window.location.href = res.data.downloadLink;
			});
		}
	}),
	withLang
);

export default enhancer(Document);
