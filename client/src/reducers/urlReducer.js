import {URL_CREATE, URL_DELETE, URL_GET, URL_UPDATE, URL_LOADING} from '../actions/types';

const initialState = {
    urls: [],
    urlCount: 0,
    loading: false
}

export default function(state = initialState, action){
    switch(action.type){
        case URL_GET:
            return { 
                ...state,
                urls: action.payload ? action.payload.urls : [],
                urlCount: action.payload ? action.payload.count: 0,
                loading: false
            }

        case URL_DELETE:
            return {
                ...state,
                urls: state.urls.filter(url => url.urlCode !== action.payload),
                urlCount: state.urlCount - 1,
            }
        case URL_LOADING:
            return {
                ...state,
                loading: true
            }
        default:
            return state;
    }
}