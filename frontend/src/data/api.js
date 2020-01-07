import Axios from 'axios';
import { clearAuthToken } from './duck';

let axios;

const getAxios = (apiBase, token, reduxDispatch) => {
	axios = Axios.create({
		baseURL: apiBase,
		headers: {
			Authorization: token || ''
		}
	});

	axios.interceptors.response.use(null, error => {
		if (error.response.status == 401) {
			reduxDispatch(clearAuthToken());
		}

		return response;
	});

	return axios;
};

export const listModels = (modelName, params, publicEndpoint = false) =>
	axios.get('/' + (publicEndpoint ? 'public/' : '') + modelName, params);

export const getModel = (modelName, id, params, publicEndpoint = false) =>
	axios.get(
		'/' + (publicEndpoint ? 'public/' : '') + modelName + '/' + id,
		params
	);

export const createModel = (modelName, params) =>
	axios.post('/' + modelName, params);

export const updateModel = (modelName, id, params) =>
	axios.put('/' + modelName + '/' + id, params);

export const deleteModel = (modelName, id) =>
	axios.delete('/' + modelName + '/' + id);

export { axios };

export default getAxios;
