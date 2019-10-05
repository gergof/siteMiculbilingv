import { listModels, createModel } from '../../../data/api';
import { normalize, pluck } from '../../../utils';
import { addNotification } from '../../../data/duck';
import { getLang } from '../../../lang';

export const types = {
	SET_ENTRIES_LOADING: 'ENTRIES::LOADING@SET',
	LOAD_ENTRIES: 'ENTRIES@LOAD',
	ADD_ENTRY: 'ENTRIES@ADD',
	DELETE_ENTRY: 'ENTRIES@DELETE'
};

const initialState = {
	entries: {
		loading: false,
		store: {},
		list: []
	}
};

const reducer = (state = initialState, action) => {
	switch (action.type) {
		case types.SET_ENTRIES_LOADING:
			return {
				...state,
				entries: {
					...state.entries,
					loading: action.payload
				}
			};
		case types.LOAD_ENTRIES:
			return {
				...state,
				entries: {
					...state.entries,
					store: normalize(action.payload),
					list: pluck(action.payload, 'id')
				}
			};
		case types.ADD_ENTRY:
			return {
				...state,
				entries: {
					...state.entries,
					store: {
						...state.entries.store,
						[action.payload.id]: action.payload
					},
					list: [...state.entries.list, action.payload.id]
				}
			};
		case types.DELETE_ENTRY:
			return {
				...state,
				entries: {
					...state.entries,
					list: state.entries.list.filter(id => id != action.payload)
				}
			};
		default:
			return state;
	}
};

export const setEntriesLoading = (loading = true) => ({
	type: types.SET_ENTRIES_LOADING,
	payload: loading
});

export const loadEntries = entries => ({
	type: types.LOAD_ENTRIES,
	payload: entries
});

export const addEntry = entry => ({
	type: types.ADD_ENTRY,
	payload: entry
});

export const deleteEntry = id => ({
	type: types.DELETE_ENTRY,
	payload: id
});

export const fetchEntries = () => (dispatch, getState) => {
	const seasonId = getState().app.seasons.store[getState().app.seasons.list[0]]
		.id;

	dispatch(setEntriesLoading(true));

	listModels('students', { params: { season_id: seasonId, own: 1 } }).then(
		res => {
			dispatch(loadEntries(res.data));
			dispatch(setEntriesLoading(false));
		}
	);
};

export const createEntry = entry => dispatch => {
	dispatch(addEntry({ ...entry, id: 'new', loading: true }));

	createModel('students', { ...entry, phase_id: process.env.ENTRY_PHASE }).then(
		res => {
			dispatch(deleteEntry('new'));
			dispatch(addEntry(res.data));
		},
		error => {
			dispatch(deleteEntry('new'));

			switch (error.response.data.error) {
				case 'Deadline has already passed':
					dispatch(addNotification('error', getLang().deadlinePassed));
					break;
				case 'Already having max entries':
					dispatch(addNotification('error', getLang().alreadyMaxEntries));
					break;
				case 'You are not teaching in any classes based on your profile':
				case 'You are not teaching in that class':
					dispatch(addNotification('error', getLang().notTeachingInThatClass));
					break;
				default:
					dispatch(addNotification('error', getLang().error500));
			}
		}
	);
};

export default reducer;
