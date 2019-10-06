import {
	listModels,
	createModel,
	updateModel,
	deleteModel
} from '../../../data/api';
import { normalize, pluck } from '../../../utils';

export const types = {
	SET_MESSAGES_LOADING: 'MESSAGES::LOADING@SET',
	LOAD_MESSAGES: 'MESSAGES@LOAD',
	UPDATE_MESSAGE: 'MESSAGES@UPDATE',
	SET_MESSAGE_LOADING: 'MESSAGES::MESSAGE::LOADING@SET',
	LOAD_SENT_MESSAGES: 'MESSAGES_SENT@LOAD',
	ADD_SENT_MESSAGE: 'MESSAGES_SENT@ADD',
	UPDATE_SENT_MESSAGE: 'MESSAGES_SENT@UPDATE',
	DELETE_SENT_MESSAGE: 'MESSAGES_SENT@DELETE',
	SET_SENT_MESSAGE_LOADING: 'MESSAGES_SENT::MESSAGE::LOADING@SET'
};

const initialState = {
	messages: {
		loading: false,
		received: {
			store: {},
			list: []
		},
		sent: {
			store: {},
			list: []
		}
	}
};

const reducer = (state = initialState, action) => {
	switch (action.type) {
		case types.SET_MESSAGES_LOADING:
			return {
				...state,
				messages: {
					...state.messages,
					loading: action.payload
				}
			};
		case types.LOAD_MESSAGES:
			return {
				...state,
				messages: {
					...state.messages,
					received: {
						...state.messages.received,
						store: normalize(action.payload),
						list: pluck(action.payload, 'id')
					}
				}
			};
		case types.UPDATE_MESSAGE:
			return {
				...state,
				messages: {
					...state.messages,
					received: {
						...state.messages.received,
						store: {
							...state.messages.received.store,
							[action.payload.id]: action.payload
						}
					}
				}
			};
		case types.SET_MESSAGE_LOADING:
			return {
				...state,
				messages: {
					...state.messages,
					received: {
						...state.messages.received,
						store: {
							...state.messages.received.store,
							[action.payload.id]: {
								...state.messages.received.store[action.payload.id],
								loading: action.payload.loading
							}
						}
					}
				}
			};
		case types.LOAD_SENT_MESSAGES:
			return {
				...state,
				messages: {
					...state.messages,
					sent: {
						...state.messages.sent,
						store: normalize(action.payload),
						list: pluck(action.payload, 'id')
					}
				}
			};
		case types.ADD_SENT_MESSAGE:
			return {
				...state,
				messages: {
					...state.messages,
					sent: {
						...state.messages.sent,
						store: {
							...state.messages.sent.store,
							[action.payload.id]: action.payload
						},
						list: [...state.messages.sent.list, action.payload.id]
					}
				}
			};
		case types.UPDATE_SENT_MESSAGE:
			return {
				...state,
				messages: {
					...state.messages,
					sent: {
						...state.messages.sent,
						store: {
							...state.messages.sent.store,
							[action.payload.id]: action.payload
						}
					}
				}
			};
		case types.DELETE_SENT_MESSAGE:
			return {
				...state,
				messages: {
					...state.messages,
					sent: {
						...state.messages.sent,
						list: state.messages.sent.list.filter(id => id != action.payload)
					}
				}
			};
		case types.SET_SENT_MESSAGE_LOADING:
			return {
				...state,
				messages: {
					...state.messages,
					sent: {
						...state.messages.sent,
						store: {
							...state.messages.sent.store,
							[action.payload.id]: {
								...state.messages.sent.store[action.payload.id],
								loading: action.payload.loading
							}
						}
					}
				}
			};
		default:
			return state;
	}
};

export const setMessagesLoading = (loading = true) => ({
	type: types.SET_MESSAGES_LOADING,
	payload: loading
});

export const loadMessages = messages => ({
	type: types.LOAD_MESSAGES,
	payload: messages
});

export const updateMessage = message => ({
	type: types.UPDATE_MESSAGE,
	payload: message
});

export const setMessageLoading = (id, loading = true) => ({
	type: types.SET_MESSAGE_LOADING,
	payload: {
		id,
		loading
	}
});

export const loadSentMessages = messages => ({
	type: types.LOAD_SENT_MESSAGES,
	payload: messages
});

export const addSentMessage = message => ({
	type: types.ADD_SENT_MESSAGE,
	payload: message
});

export const updateSentMessage = message => ({
	type: types.UPDATE_SENT_MESSAGE,
	payload: message
});

export const deleteSentMessage = id => ({
	type: types.DELETE_SENT_MESSAGE,
	payload: id
});

export const setSentMessageLoading = (id, loading = true) => ({
	type: types.SET_SENT_MESSAGE_LOADING,
	payload: { id, loading }
});

export const fetchMessages = () => dispatch => {
	dispatch(setMessagesLoading(true));

	listModels('messages').then(res => {
		dispatch(loadMessages(res.data));
		dispatch(setMessagesLoading(false));
	});
};

export const markMessageAsRead = (id, read = false) => dispatch => {
	dispatch(setMessageLoading(id, true));

	updateModel('messages', id, { is_read: read }).then(res => {
		dispatch(updateMessage(res.data));
		dispatch(setMessageLoading(id, false));
	});
};

export const fetchSentMessages = () => dispatch => {
	dispatch(setMessagesLoading(true));

	listModels('messages', { params: { sent: 1 } }).then(res => {
		dispatch(loadSentMessages(res.data));
		dispatch(setMessagesLoading(false));
	});
};

export const sendMessage = message => dispatch => {
	dispatch(addSentMessage({ ...message, loading: true, id: 'new' }));

	createModel('messages', message)
		.then(res => {
			dispatch(deleteSentMessage('new'));
			dispatch(addSentMessage(res.data));
		})
		.catch(() => {
			dispatch(deleteSentMessage('new'));
		});
};

export const patchSentMessage = (id, patch) => dispatch => {
	dispatch(setSentMessageLoading(id, true));

	updateModel('messages', id, patch).then(res => {
		dispatch(updateSentMessage(res.data));
		dispatch(setSentMessageLoading(id, false));
	});
};

export const deleteMessage = id => dispatch => {
	dispatch(setSentMessageLoading(id, true));

	deleteModel('messages', id).then(() => {
		dispatch(deleteSentMessage(id));
	});
};

export default reducer;
