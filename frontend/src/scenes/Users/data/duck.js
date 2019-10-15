import { listModels } from '../../../data/api';
import { normalize, pluck, groupBy } from '../../../utils';

export const types = {
	SET_USERS_LOADING: 'USERS::LOADING@SET',
	LOAD_USERS: 'USERS@LOAD'
};

const initialState = {
	users: {
		loading: false,
		store: {},
		list: [],
		bySchool: {}
	}
};

const reducer = (state = initialState, action) => {
	switch (action.type) {
		case types.SET_USERS_LOADING:
			return {
				...state,
				users: {
					...state.users,
					loading: action.payload
				}
			};
		case types.LOAD_USERS:
			return {
				...state,
				users: {
					...state.users,
					store: normalize(action.payload),
					list: pluck(action.payload, 'id'),
					bySchool: groupBy(action.payload, 'school_id')
				}
			};
		default:
			return state;
	}
};

export const setUsersLoading = (loading = true) => ({
	type: types.SET_USERS_LOADING,
	payload: loading
});

export const loadUsers = users => ({
	type: types.LOAD_USERS,
	payload: users
});

export const fetchUsers = () => dispatch => {
	dispatch(setUsersLoading(true));

	listModels('users').then(res => {
		dispatch(loadUsers(res.data));
		dispatch(setUsersLoading(false));
	});
};

export default reducer;
