import Axios from 'axios';

let axios;

const getAxios = apiBase => {
	axios = Axios.create({
		baseURL: apiBase,
		headers: {
			Authorization: ''
		}
	});

	return axios;
};

export const listModels = (modelName, params, public = false) =>
	axios.get('/' + (public && 'public/') + modelName, {
		params: params
	});

export const getModel = (modelName, id, params, public = false) =>
	axios.get('/' + (public && 'public/') + modelName + '/' + id, {
		params: params
	});

export const createModel = (modelName, params) =>
	axios.post('/' + modelName, {
		params: params
	});

export const updateModel = (modelName, id, params) =>
	axios.put('/' + modelName + '/' + id, {
		params: params
	});

export const deleteModel = (modelName, id) =>
	axios.delete('/' + modelName + '/' + id);

export { axios };

export default getAxios;
