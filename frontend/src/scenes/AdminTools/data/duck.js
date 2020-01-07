import { listModels } from '../../../data/api';
import { normalize, pluck } from '../../../utils';

export const types = {
	SET_SCHOOLS_LOADING: 'SCHOOLS::LOADING@SET',
	LOAD_SCHOOLS: 'SCHOOLS@LOAD',
	ADD_SCHOOL: 'SCHOOL@ADD',
	UPDATE_SCHOOL: 'SCHOOL@UPDATE',
	DELETE_SCHOOL: 'SCHOOL@DELETE',

	SET_USERS_LOADING: 'USERS::LOADING@SET',
	LOAD_USERS: 'USERS@LOAD',

	SET_STUDENTS_LOADING: 'STUDENTS::LOADING@SET',
	LOAD_STUDENTS: 'STUDENTS@LOAD',
	ADD_STUDENT: 'STUDENTS@ADD',
	UPDATE_STUDENT: 'STUDENT@UPDATE'
};

const initialState = {
	schools: {
		loading: false,
		store: {},
		list: []
	},
	users: {
		loading: false,
		store: {},
		list: []
	},
	students: {
		loading: false,
		store: {},
		list: []
	}
};

const reducer = (state = initialState, action) => {
	switch (action.type) {
		case types.SET_SCHOOLS_LOADING:
			return {
				...state,
				schools: {
					...state.schools,
					loading: action.payload
				}
			};
		case types.LOAD_SCHOOLS:
			return {
				...state,
				schools: {
					...state.schools,
					store: normalize(action.payload),
					list: pluck(action.payload, 'id')
				}
			};
		case types.ADD_SCHOOL:
			return {
				...state,
				schools: {
					...state.schools,
					store: {
						...state.schools.store,
						[action.payload.id]: action.payload
					},
					list: [...state.schools.list, action.payload.id]
				}
			};
		case types.UPDATE_SCHOOL:
			return {
				...state,
				schools: {
					...state.schools,
					store: {
						...state.schools.store,
						[action.payload.id]: action.payload
					}
				}
			};
		case types.DELETE_SCHOOL:
			return {
				...state,
				schools: {
					...state.schools,
					list: state.schools.list.filter(id => id != action.payload)
				}
			};
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
					list: pluck(action.payload, 'id')
				}
			};
		case types.SET_STUDENTS_LOADING:
			return {
				...state,
				students: {
					...state.students,
					loading: action.payload
				}
			};
		case types.LOAD_STUDENTS:
			return {
				...state,
				students: {
					...state.students,
					store: normalize(action.payload),
					list: pluck(action.payload, 'id')
				}
			};
		case types.ADD_STUDENT:
			return {
				...state,
				students: {
					...state.students,
					store: {
						...state.students.store,
						[action.payload.id]: action.payload
					},
					list: [...state.students.list, action.payload.id]
				}
			};
		case types.UPDATE_STUDENT:
			return {
				...state,
				students: {
					...state.students,
					store: {
						...state.students.store,
						[action.payload.id]: action.payload
					}
				}
			};
		default:
			return state;
	}
};

export const setSchoolsLoading = (loading = true) => ({
	type: types.SET_SCHOOLS_LOADING,
	payload: loading
});

export const loadSchools = schools => ({
	type: types.LOAD_SCHOOLS,
	payload: schools
});

export const addSchool = school => ({
	type: types.ADD_SCHOOL,
	payload: school
});

export const updateSchool = school => ({
	type: types.UPDATE_SCHOOL,
	payload: school
});

export const deleteSchool = id => ({
	type: types.DELETE_SCHOOL,
	payload: id
});

export const setUsersLoading = (loading = true) => ({
	type: types.SET_USERS_LOADING,
	payload: loading
});

export const loadUsers = users => ({
	type: types.LOAD_USERS,
	payload: users
});

export const setStudentsLoading = (loading = true) => ({
	type: types.SET_STUDENTS_LOADING,
	payload: loading
});

export const loadStudents = students => ({
	type: types.LOAD_STUDENTS,
	payload: students
});

export const addStudent = student => ({
	type: types.ADD_STUDENT,
	payload: student
});

export const updateStudent = student => ({
	type: types.UPDATE_STUDENT,
	payload: student
});

export const fetchSchools = () => dispatch => {
	dispatch(setSchoolsLoading(true));

	listModels('schools').then(res => {
		dispatch(loadSchools(res.data));
		dispatch(setSchoolsLoading(false));
	});
};

export const fetchUsers = () => dispatch => {
	dispatch(setUsersLoading(true));

	listModels('users').then(res => {
		dispatch(loadUsers(res.data));
		dispatch(setUsersLoading(false));
	});
};

export const fetchStudents = seasonId => dispatch => {
	dispatch(setStudentsLoading(true));

	listModels('students', { params: { season_id: seasonId } }).then(res => {
		dispatch(loadStudents(res.data));
		dispatch(setStudentsLoading(false));
	});
};

export default reducer;
