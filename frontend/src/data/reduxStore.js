import { createStore, combineReducers, applyMiddleware } from 'redux';
import thunkMiddleware from 'redux-thunk';
import { persistStore, persistReducer } from 'redux-persist';
import storage from 'redux-persist/lib/storage';

import appDuck from './duck';

const rootReducer = combineReducers({
	app: appDuck
});

const persistedReducer = persistReducer({ key: 'root', storage }, rootReducer);

const configureStore = () => {
	let store = createStore(persistedReducer, applyMiddleware(thunkMiddleware));
	let persistor = persistStore(store);

	return { store, persistor };
};

export default configureStore;
