import { AppActions, UrlActionTypes } from '../types/actions';
import {UrlState} from '../types/Url';
const initialState: UrlState = {
	urls: [],
	urlCount: 0,
	loading: false,
	errors: [],
};

export default function(state:UrlState = initialState, action: UrlActionTypes) {
	switch (action.type) {
		case 'URL_GET':
			return {
				...state,
				urls: action.urls,
				urlCount: action.urlCount,
				loading: false,
			};
		case 'URL_CREATE':
			return {
				...state,
				urls: [
					{
						originalUrl: action.url.originalUrl,
						code: action.url.code,
					},
					...state.urls,
				],
				urlCount: state.urlCount + 1,
				loading: false,
			};
		case 'URL_EDIT':
			return {
				...state,
				urls: [
					{
						originalUrl: action.url.originalUrl,
						code: action.url.code,
					},
					...state.urls.filter(url => url.code !== action.url.code),
				],
				loading: false,
			};

		case 'URL_DELETE':
			return {
				...state,
				urls: state.urls.filter(url => url.code !== action.url.code),
				urlCount: state.urlCount - 1,
			};
		case 'URL_LOADING':
			return {
				...state,
				loading: true,
            };
        case 'URL_ERROR':
            return {
                ...state,
                error: action.error
            }
		default:
			return state;
	}
}
