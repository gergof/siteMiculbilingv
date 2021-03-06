import { createStore, combineReducers, applyMiddleware } from 'redux';
import thunkMiddleware from 'redux-thunk';
import { composeWithDevTools } from 'redux-devtools-extension';
import { persistStore, persistReducer } from 'redux-persist';
import storage from 'redux-persist/lib/storage';
import packageJson from '../../package.json';

import appDuck from './duck';
import indexDuck from '../scenes/Index/data/duck';
import documentsDuck from '../scenes/Documents/data/duck';
import entriesDuck from '../scenes/Enter/data/duck';
import profileDuck from '../scenes/Profile/data/duck';
import messagesDuck from '../scenes/Messages/data/duck';
import usersDuck from '../scenes/Users/data/duck';
import adminToolsDuck from '../scenes/AdminTools/data/duck';

const rootReducer = combineReducers({
	app: appDuck,
	index: indexDuck,
	documents: documentsDuck,
	enter: entriesDuck,
	profile: profileDuck,
	messages: messagesDuck,
	users: usersDuck,
	adminTools: adminToolsDuck
});

const configureStore = () => {
	// reset store if app was updated
	if (localStorage.getItem('mb:version') != packageJson.version) {
		localStorage.removeItem('persist:root');
		localStorage.setItem('mb:version', packageJson.version);
	}

	const persistedReducer = persistReducer(
		{ key: 'root', storage },
		rootReducer
	);

	let store = createStore(
		persistedReducer,
		composeWithDevTools(applyMiddleware(thunkMiddleware))
	);
	let persistor = persistStore(store);

	return { store, persistor };
};

export default configureStore;
