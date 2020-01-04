import {URL_CREATE, URL_DELETE, URL_GET, URL_EDIT, URL_LOADING} from '../actions/types';

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
        case URL_CREATE:
            if(action.payload){
                return{
                    ...state,
                    urls: [
                        {
                            originalUrl: action.payload.originalUrl,
                            code: action.payload.code
                        },
                        ...state.urls],
                    urlCount: state.urlCount + 1,
                    loading: false
                }
            }else{
                return {
                    ...state,
                    loading: false
                }
            }
        case URL_EDIT:
            if(action.payload){
                return{
                    ...state,
                    urls: [
                        {
                            originalUrl: action.payload.originalUrl,
                            code: action.payload.code
                        },
                        ...state.urls.filter((url)=>url.code!==action.payload.code)],
                    loading: false
                }
            }else{
                return {
                    ...state,
                    loading: false
                }
            }
        case URL_DELETE:
            return {
                ...state,
                urls: state.urls.filter(url => url.code !== action.payload),
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