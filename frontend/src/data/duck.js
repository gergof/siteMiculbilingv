import uuidv4 from 'uuid/v4';
import { axios } from './api';
import { getLang } from '../lang';

export const types = {
	SET_AUTH_TOKEN: 'AUTH::TOKEN@SET',
	CLEAR_AUTH_TOKEN: 'AUTH::TOKEN@CLEAR',
	SET_AUTH_LOADING: 'AUTH::LOADING@SET',
	ADD_NOTIFICATION: 'NOTIFICATION@ADD',
	DELETE_NOTIFICATION: 'NOTIFICATION@DELETE',
	SET_LANGUAGE: 'CONFIG::LANG@SET'
};

const initialState = {
	auth: {
		token: null,
		loading: false
	},
	config: {
		language: process.env.DEFAULT_LANGUAGE || 'hu_HU'
	},
	notifications: []
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
				notifications: notifications.filter(
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

export const login = cred => dispatch => {
	dispatch(setAuthLoading(true));
	axios
		.post('/auth/login', {
			email: cred.email,
			password: cred.password
		})
		.then(resp => {
			dispatch(setAuthLoading(false));
			if (resp.status != 200) {
				dispatch(addNotification('error', getLang().loginError));
			} else {
				dispatch(setAuthToken(resp.data.token));
				axios.defaults.headers['Authorization'] = resp.data.token;
				dispatch(addNotification('success', getLang().loginSuccess));
			}
		});
};

export const logout = () => (dispatch, getState) => {
	if (getState().app.auth.token) {
		dispatch(setAuthLoading(true));
		axios.post('/auth/logout').then(resp => {
			dispatch(setAuthLoading(false));
			dispatch(clearAuthToken());
			axios.defaults.headers['Authorization'] = '';
			dispatch(addNotification('success', getLang().logoutSuccess));
		});
	}
};

export default reducer;
