import axios from 'axios';
import config from '../config/config';
import { User } from '../types/User';
import { AppActions } from '../types/actions';
import { Dispatch } from 'redux';
import { ThunkAction } from 'redux-thunk';
axios.defaults.withCredentials = true;
const serverUrl = config.serverUrl + '/api/user';

export const registerUser = (user: User): AppActions => ({
	type: 'USER_REGISTER',
	payload: user,
});

export const loginUser = (user: User): AppActions => ({
	type: 'USER_LOGIN',
	payload: user,
});

export const logoutUser = (user: User): AppActions => ({
	type: 'USER_LOGOUT',
	payload: user,
});

export const editUser = (user: User): AppActions => ({
	type: 'USER_EDIT',
	payload: user,
});

export const deleteUser = (): AppActions => ({
	type: 'USER_DELETE'
});

export const checkUserSession = (user: User): AppActions => ({
	type: 'USER_CHECK_SESSION',
	payload: user,
});

export const setUserError = (errors: string[]|string): AppActions => ({
	type: 'USER_ERROR',
	payload: (errors instanceof Array ? errors as string[] : [errors as string]),
});

export const setUserLoading = (error: string): AppActions => ({
	type: 'USER_LOADING',
});

export const startRegisterUser = (
	user: User
): ThunkAction<Promise<void>, void, void, AppActions> => (
	dispatch: Dispatch<AppActions>
): Promise<void> => {
	// dispatch(setUserLoading());
	return axios
		.post(serverUrl + '/register', user)
		.then(res => {
			dispatch(registerUser(res.data));
		})
		.catch(error => {
			console.log(error.response);
			dispatch(setUserError(error.response.data.message));
		});
};

export const startLoginUser = (
	user: User
): ThunkAction<Promise<void>, void, void, AppActions> => (
	dispatch: Dispatch<AppActions>
): Promise<void> => {
	// dispatch(setUserLoading());
	return axios
		.post(serverUrl + '/login', user)
		.then(res => {
			console.log(res.data);
			dispatch(loginUser(res.data));
		})
		.catch(error => {
			console.log(error.response);
			dispatch(setUserError(error.response.data.message));
		});
};

export const startLogoutUser = (): ThunkAction<
	Promise<void>,
	void,
	void,
	AppActions
> => (dispatch: Dispatch<AppActions>): Promise<void> => {
	// dispatch(setUserLoading());

	return axios
		.post(serverUrl + '/logout')
		.then(res => {
			dispatch(logoutUser(res.data));
		})
		.catch(error => {
			console.log(error.response);
			dispatch(setUserError(error.response.data.message));
		});
};

export const startEditUser = (
	user: User
): ThunkAction<Promise<void>, void, void, AppActions> => (
	dispatch: Dispatch<AppActions>
): Promise<void> => {
	// dispatch(setUserLoading());

	return axios
		.put(serverUrl + '/edit', user)
		.then(res => {
			dispatch(editUser(res.data));
		})
		.catch(error => {
			console.log(error.response);
			dispatch(setUserError(error.response.data.message));
		});
};

export const startDeleteUser = (
): ThunkAction<Promise<void>, void, void, AppActions> => (
	dispatch: Dispatch<AppActions>
): Promise<void> => {
	// dispatch(setUserLoading());

	return axios
		.delete(serverUrl + '/')
		.then(res => {
			dispatch(deleteUser());
		})
		.catch(error => {
			console.log(error.response);
			dispatch(setUserError(error.response.data.message));
		});
};

export const startCheckUserSession = (): ThunkAction<
	Promise<void>,
	void,
	void,
	AppActions
> => (dispatch: Dispatch<AppActions>): Promise<void> => {
	// dispatch(setUserLoading());

	return axios
		.get(serverUrl + '/usernameandemail')
		.then(res => {
			console.log(res.data);
			dispatch(checkUserSession(res.data));
		})
		.catch(error => {
			console.log(error.response);
			dispatch(setUserError(error.response.data.message));
		});
};
