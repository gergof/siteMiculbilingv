import { getModel, updateModel } from '../../../data/api';
import { addNotification } from '../../../data/duck';
import { getLang } from '../../../lang';

export const types = {
	SET_PROFILE_LOADING: 'PROFILE::LOADING@SET',
	LOAD_PROFILE: 'PROFILE@LOAD',
	UPDATE_PROFILE: 'PROFILE@UPDATE'
};

const initialState = {
	profile: {
		data: {},
		loading: false
	}
};

const reducer = (state = initialState, action) => {
	switch (action.type) {
		case types.SET_PROFILE_LOADING:
			return {
				...state,
				profile: {
					...state.profile,
					loading: action.payload
				}
			};
		case types.LOAD_PROFILE:
			return {
				...state,
				profile: {
					...state.profile,
					data: action.payload
				}
			};
		case types.UPDATE_PROFILE:
			return {
				...state,
				profile: {
					...state.profile,
					data: action.payload
				}
			};
		default:
			return state;
	}
};

export const setProfileLoading = (loading = true) => ({
	type: types.SET_PROFILE_LOADING,
	payload: loading
});

export const loadProfile = profile => ({
	type: types.LOAD_PROFILE,
	payload: profile
});

export const updateProfile = profile => ({
	type: types.UPDATE_PROFILE,
	payload: profile
});

export const fetchProfile = () => dispatch => {
	dispatch(setProfileLoading(true));

	getModel('me', '').then(res => {
		dispatch(loadProfile(res.data));
		dispatch(setProfileLoading(false));
	});
};

export const patchProfile = patch => dispatch => {
	dispatch(setProfileLoading(true));

	updateModel('me', '', patch).then(
		res => {
			dispatch(updateProfile(res.data));
			dispatch(setProfileLoading(false));
		},
		() => {
			dispatch(setProfileLoading(false));
			dispatch(addNotification('error', getLang().error500));
		}
	);
};

export default reducer;
