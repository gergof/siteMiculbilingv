import { createStore, combineReducers, applyMiddleware } from 'redux';
import thunkMiddleware from 'redux-thunk';
import { composeWithDevTools } from 'redux-devtools-extension';
import { persistStore, persistReducer } from 'redux-persist';
import storage from 'redux-persist/lib/storage';

import appDuck from './duck';
import indexDuck from '../scenes/Index/data/duck';
import documentsDuck from '../scenes/Documents/data/duck';

const rootReducer = combineReducers({
	app: appDuck,
	index: indexDuck,
	documents: documentsDuck
});

const persistedReducer = persistReducer({ key: 'root', storage }, rootReducer);

const configureStore = () => {
	let store = createStore(
		persistedReducer,
		composeWithDevTools(applyMiddleware(thunkMiddleware))
	);
	let persistor = persistStore(store);

	return { store, persistor };
};

export default configureStore;
