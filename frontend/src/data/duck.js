import uuidv4 from 'uuid/v4';
import { axios, listModels } from './api';
import { normalize, pluck } from '../utils';
import { getLang } from '../lang';

export const types = {
	SET_AUTH_TOKEN: 'AUTH::TOKEN@SET',
	CLEAR_AUTH_TOKEN: 'AUTH::TOKEN@CLEAR',
	SET_AUTH_LOADING: 'AUTH::LOADING@SET',
	ADD_NOTIFICATION: 'NOTIFICATION@ADD',
	DELETE_NOTIFICATION: 'NOTIFICATION@DELETE',
	SET_LANGUAGE: 'CONFIG::LANG@SET',
	SET_SEASONS_LOADING: 'SEASONS::LOADING@SET',
	LOAD_SEASONS: 'SEASONS@LOAD'
};

const initialState = {
	auth: {
		token: null,
		loading: false
	},
	config: {
		language: process.env.DEFAULT_LANGUAGE || 'hu_HU'
	},
	notifications: [],
	seasons: {
		loading: false,
		store: {},
		list: []
	}
};

const reducer = (state = initialState, action) => {
	switch (action.type) {
		case types.SET_AUTH_TOKEN:
			return {
				...state,
				auth: {
					...state.auth,
					token: action.payload
				}
			};
		case types.CLEAR_AUTH_TOKEN:
			return {
				...state,
				auth: {
					...state.auth,
					token: null
				}
			};
		case types.SET_AUTH_LOADING:
			return {
				...state,
				auth: {
					...state.auth,
					loading: action.payload
				}
			};
		case types.ADD_NOTIFICATION:
			return {
				...state,
				notifications: [...state.notifications, action.payload]
			};
		case types.DELETE_NOTIFICATION:
			return {
				...state,
				notifications: state.notifications.filter(
					notification => notification.id != action.payload
				)
			};
		case types.SET_LANGUAGE:
			return {
				...state,
				config: {
					...state.config,
					language: action.payload
				}
			};
		case types.SET_SEASONS_LOADING:
			return {
				...state,
				seasons: {
					...state.seasons,
					loading: action.payload
				}
			};
		case types.LOAD_SEASONS:
			return {
				...state,
				seasons: {
					...state.seasons,
					store: normalize(action.payload),
					list: pluck(action.payload, 'id')
				}
			};
		default:
			return state;
	}
};

export const setAuthToken = token => ({
	type: types.SET_AUTH_TOKEN,
	payload: token
});

export const clearAuthToken = () => ({
	type: types.CLEAR_AUTH_TOKEN
});

export const setAuthLoading = state => ({
	type: types.SET_AUTH_LOADING,
	payload: state
});

export const addNotification = (type, message) => ({
	type: types.ADD_NOTIFICATION,
	payload: {
		id: uuidv4(),
		type: type,
		message: message
	}
});

export const deleteNotification = id => ({
	type: types.DELETE_NOTIFICATION,
	payload: id
});

export const setLanguage = lang => ({
	type: types.SET_LANGUAGE,
	payload: lang
});

export const setSeasonsLoading = (loading = true) => ({
	type: types.SET_SEASONS_LOADING,
	payload: loading
});

export const loadSeasons = seasons => ({
	type: types.LOAD_SEASONS,
	payload: seasons
});

export const login = cred => dispatch => {
	dispatch(setAuthLoading(true));
	axios
		.post('/auth/login', {
			email: cred.email,
			password: cred.password
		})
		.then(
			resp => {
				dispatch(setAuthLoading(false));
				axios.defaults.headers['Authorization'] = resp.data.token;
				dispatch(setAuthToken(resp.data.token));
				dispatch(addNotification('success', getLang().loginSuccess));
			},
			() => {
				dispatch(setAuthLoading(false));
				dispatch(addNotification('error', getLang().loginError));
			}
		);
};

export const logout = () => (dispatch, getState) => {
	if (getState().app.auth.token) {
		dispatch(setAuthLoading(true));
		axios.post('/auth/logout').then(() => {
			axios.defaults.headers['Authorization'] = '';
			dispatch(setAuthLoading(false));
			dispatch(clearAuthToken());
			dispatch(addNotification('success', getLang().logoutSuccess));
		});
	}
};

export const fetchSeasons = () => dispatch => {
	dispatch(setSeasonsLoading(true));
	listModels('seasons', null, true).then(resp => {
		dispatch(loadSeasons(resp.data));
		dispatch(setSeasonsLoading(false));
	});
};

export default reducer;
