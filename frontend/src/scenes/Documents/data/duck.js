import { listModels } from '../../../data/api';
import { normalize, pluck, groupBy } from '../../../utils';

export const types = {
	SET_DOCUMENTS_LOADING: 'DOCUMENTS::LOADING@SET',
	LOAD_DOCUMENTS: 'DOCUMENTS@LOAD'
};

const initialState = {
	documents: {
		loading: false,
		store: {},
		bySeason: {},
		list: []
	}
};

const reducer = (state = initialState, action) => {
	switch (action.type) {
		case types.SET_DOCUMENTS_LOADING:
			return {
				...state,
				documents: {
					...state.documents,
					loading: action.payload
				}
			};
		case types.LOAD_DOCUMENTS:
			return {
				...state,
				documents: {
					...state.documents,
					store: normalize(action.payload),
					list: pluck(action.payload, 'id'),
					bySeason: groupBy(action.payload, 'season_id')
				}
			};
		default:
			return state;
	}
};

export const setDocumentsLoading = (loading = true) => ({
	type: types.SET_DOCUMENTS_LOADING,
	payload: loading
});

export const loadDocuments = documents => ({
	type: types.LOAD_DOCUMENTS,
	payload: documents
});

export const fetchDocuments = () => (dispatch, getState) => {
	const isLogged = !!getState().app.auth.token;

	dispatch(setDocumentsLoading(true));

	listModels('documents', null, !isLogged).then(res => {
		dispatch(loadDocuments(res.data));
		dispatch(setDocumentsLoading(false));
	});
};

export default reducer;
