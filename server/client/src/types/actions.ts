import { Url } from './Url';
import { User } from './User';

//USER
export const USER_LOGIN = 'USER_LOGIN';
export const USER_REGISTER = 'USER_REGISTER';
export const USER_LOGOUT = 'USER_LOGOUT';
export const USER_LOADING = 'USER_LOADING';
export const USER_EDIT = 'USER_EDIT';
export const USER_DELETE = 'USER_DELETE';
export const USER_CHECK_SESSION = 'USER_CHECK_SESSION';
export const USER_ERROR = 'USER_ERROR';
export interface UserLoginAction {
	type: typeof USER_LOGIN;
	payload: User;
}

export interface UserRegisterAction {
	type: typeof USER_REGISTER;
	payload: User;
}

export interface UserLogoutAction {
	type: typeof USER_LOGOUT;
	payload: User;
}

export interface UserLoadingAction {
	type: typeof USER_LOADING;
}

export interface UserEditAction {
	type: typeof USER_EDIT;
	payload: User;
}

export interface UserDeleteAction {
	type: typeof USER_DELETE;
}

export interface UserCheckSessionAction {
	type: typeof USER_CHECK_SESSION;
	payload: User;
}

export interface UserErrorAction {
	type: typeof USER_ERROR;
	payload: string[];
}

export type UserActionTypes =
	| UserLoginAction
	| UserRegisterAction
	| UserLogoutAction
	| UserLoadingAction
	| UserEditAction
	| UserDeleteAction
	| UserCheckSessionAction
	| UserErrorAction;
//URL
export const URL_GET = 'URL_GET';
export const URL_CREATE = 'URL_CREATE';
export const URL_DELETE = 'URL_DELETE';
export const URL_EDIT = 'URL_EDIT';
export const URL_LOADING = 'URL_LOADING';
export const URL_ERROR = 'URL_ERROR';
export const URL_ANALYZE = 'URL_ANALYZE';

export interface UrlGetAction {
	type: typeof URL_GET;
	urls: Url[];
	urlCount: number;
}

export interface UrlCreateAction {
	type: typeof URL_CREATE;
	url: Url
}

export interface UrlDeleteAction {
	type: typeof URL_DELETE;
	url: Url
}

export interface UrlEditAction {
	type: typeof URL_EDIT;
	url: Url;
}

export interface UrlLoadingAction {
	type: typeof URL_LOADING;
}

export interface UrlErrorAction {
	type: typeof URL_ERROR;
	error: [];
}

export type UrlActionTypes =
	| UrlGetAction
	| UrlCreateAction
	| UrlDeleteAction
	| UrlEditAction
	| UrlLoadingAction
	| UrlErrorAction;

export type AppActions = UserActionTypes | UrlActionTypes;
