import axios from 'axios';
import { AppActions } from '../types/actions';
import config from '../config/config';
import { Dispatch } from 'redux';
import { Url } from '../types/Url';
import { AppState } from '../store';
import { ThunkAction } from 'redux-thunk';
axios.defaults.withCredentials = true;
const serverUrl = config.serverUrl + '/api/url';

export const getUrls = (urls: Url[], urlsCount: number): AppActions => ({
	type: 'URL_GET',
	urls: urls,
	urlCount: urlsCount,
});

export const createUrl = (url: Url): AppActions => ({
	type: 'URL_CREATE',
	url: url,
});

export const editUrl = (url: Url): AppActions => ({
	type: 'URL_EDIT',
	url: url,
});

export const deleteUrl = (url: Url): AppActions => ({
	type: 'URL_DELETE',
	url: url,
});

export const setUrlLoading = (): AppActions => ({
	type: 'URL_LOADING',
});

export const setUrlError = (error: string): AppActions => ({
	type: 'URL_ERROR',
	error,
});

export const startGetUrls = (): ThunkAction<
	Promise<void>,
	void,
	void,
	AppActions
> => (dispatch: Dispatch<AppActions>): Promise<void> => {
	dispatch(setUrlLoading());
	return axios
		.get(serverUrl + '/')
		.then(res => {
			dispatch(getUrls(res.data.urls, res.data.count));
		})
		.catch(error => {
			console.log(error);
			dispatch(setUrlError(error.response.data.message));
		});
};

export const startCreateUrl = (
	url: Url
): ThunkAction<Promise<void>, void, void, AppActions> => (
	dispatch: Dispatch<AppActions>
): Promise<void> => {
	dispatch(setUrlLoading());
	return axios
		.post(serverUrl + '/create', url)
		.then(res => {
			console.log(res.data);
			dispatch(createUrl(res.data));
		})
		.catch(error => {
			console.log(error.response);
			dispatch(setUrlError(error.response.data.message));
		});
};

export const startEditUrl = (
	url: Url
): ThunkAction<Promise<void>, void, void, AppActions> => (
	dispatch: Dispatch<AppActions>
): Promise<void> => {
	dispatch(setUrlLoading());
	return axios
		.put(serverUrl + '/edit', url)
		.then(res => {
			console.log(res.data);
			dispatch(editUrl(res.data));
		})
		.catch(error => {
			console.log(error.response);
			dispatch(setUrlError(error.response.data.message));
		});
};

export const startDeleteUrl = (
	code: string
): ThunkAction<Promise<void>, void, void, AppActions> => (
	dispatch: Dispatch<AppActions>
): Promise<void> => {
	dispatch(setUrlLoading());
	return axios
		.delete(serverUrl + `/${code}`)
		.then(res => {
			dispatch(deleteUrl(res.data));
		})
		.catch(error => {
			console.log(error.response);
			dispatch(setUrlError(error.response.data.message));
		});
};
