export const types = {
	SET_AUTH_TOKEN: 'AUTH@SET_TOKEN',
	CLEAR_AUTH_TOKEN: 'AUTH@CLEAR_TOKEN'
};

const initialState = {
	auth: {
		token: null
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
		default:
			return state;
	}
};

export const login = cred => dispatch => {};
