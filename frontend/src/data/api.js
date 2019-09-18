import Axios from 'axios';

let axios;

const getAxios = (apiBase, token) => {
	axios = Axios.create({
		baseURL: apiBase,
		headers: {
			Authorization: token || ''
		}
	});

	return axios;
};

export const listModels = (modelName, params, publicEndpoint = false) =>
	axios.get('/' +(publicEndpoint && 'public/') + modelName, {
		params: params
	});

export const getModel = (modelName, id, params, publicEndpoint = false) =>
	axios.get('/' +(publicEndpoint && 'public/') + modelName + '/' + id, {
		params: params
	});

export const createModel = (modelName, params) =>
	axios.post('/' +modelName, {
		params: params
	});

export const updateModel = (modelName, id, params) =>
	axios.put('/' +modelName + '/' + id, {
		params: params
	});

export const deleteModel = (modelName, id) =>
	axios.delete('/' +modelName + '/' + id);

export { axios };

export default getAxios;
