export const normalize = (array, key = 'id') => {
	const res = {};
	array.forEach(el => {
		res[el[key]] = el;
	});

	return res;
};

export const pluck = (array, key) => {
	const res = array.map(el => el[key]);
	return res;
};

export const groupBy = (array, key) => {
	const res = array.reduce(
		(acc, cur) => ({ ...acc, [cur[key]]: [...(acc[cur[key]] || []), cur.id] }),
		{}
	);
	return res;
};
