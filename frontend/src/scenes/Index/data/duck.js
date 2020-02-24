import { listModels, updateModel } from '../../../data/api';
import { normalize, pluck } from '../../../utils';

export const types = {
	SET_LOADING: 'NEWS::LOADING@SET',
	LOAD_NEWS: 'NEWS@LOAD',
	LOAD_TARGETS: 'TARGETS@LOAD',
	UPDATE_TARGET: 'TARGETS@UPDATE',
	SET_TARGET_LOADING: 'TARGETS::LOADING@SET'
};

const initialState = {
	loading: false,
	news: {
		store: {},
		list: []
	},
	targets: {
		store: {},
		byNews: {},
		list: []
	}
};

const reducer = (state = initialState, action) => {
	switch (action.type) {
		case types.SET_LOADING:
			return {
				...state,
				loading: action.payload
			};
		case types.LOAD_NEWS:
			return {
				...state,
				news: {
					...state.news,
					store: normalize(action.payload),
					list: pluck(action.payload, 'id')
				}
			};
		case types.LOAD_TARGETS:
			return {
				...state,
				targets: {
					...state.targets,
					store: normalize(action.payload),
					list: pluck(action.payload, 'id'),
					byNews: action.payload.reduce(
						(acc, cur) => ({ ...acc, [cur.announcement_id]: cur.id }),
						{}
					)
				}
			};
		case types.UPDATE_TARGET:
			return {
				...state,
				targets: {
					...state.targets,
					store: {
						...state.targets.store,
						[action.payload.id]: {
							...state.targets.store[action.payload.id],
							...action.payload
						}
					}
				}
			};
		case types.SET_TARGET_LOADING:
			return {
				...state,
				targets: {
					...state.targets,
					store: {
						...state.targets.store,
						[action.payload.id]: {
							...state.targets.store[action.payload.id],
							loading: action.payload.loading
						}
					}
				}
			};
		default:
			return state;
	}
};

export const setLoading = state => ({
	type: types.SET_LOADING,
	payload: state
});

export const loadNews = news => ({
	type: types.LOAD_NEWS,
	payload: news
});

export const loadTargets = targets => ({
	type: types.LOAD_TARGETS,
	payload: targets
});

export const updateTarget = target => ({
	type: types.UPDATE_TARGET,
	payload: target
});

export const setTargetLoading = (id, loading) => ({
	type: types.SET_TARGET_LOADING,
	payload: {
		id: id,
		loading: loading
	}
});

export const fetchNews = () => (dispatch, getState) => {
	const isLogged = !!getState().app.auth.token;

	dispatch(setLoading(true));

	listModels('announcements', null, !isLogged).then(res => {
		dispatch(loadNews(res.data));
		if (isLogged) {
			listModels('announcementTargets').then(res => {
				dispatch(loadTargets(res.data));
				dispatch(setLoading(false));
			});
		}
	});
};

export const markAsRead = (id, read = true) => dispatch => {
	dispatch(setTargetLoading(id, true));

	updateModel('announcementTargets', id, { is_read: read }).then(res => {
		dispatch(updateTarget(res.data));
		dispatch(setTargetLoading(id, false));
	});
};

export default reducer;
