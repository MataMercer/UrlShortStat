import axios from 'axios';
import {URL_CREATE, URL_DELETE, URL_GET, URL_EDIT, URL_LOADING} from './types';
import config from './../config/config';
axios.defaults.withCredentials = true; 
const serverUrl = config.serverUrl + '/api/url';
export const getUrls = () => dispatch => {
    dispatch(setUrlLoading());
    return axios
        .get(serverUrl + '/')
        .then(res =>{
            dispatch({
                type: URL_GET,
                payload: res.data
            })
        })
        .catch(error =>{
            console.log(error.response);

            dispatch({
                type: URL_GET
            })

            return error;
        });

}


export const createUrl = (url) => dispatch => {
    dispatch(setUrlLoading());
    return axios
        .post(serverUrl + '/create', url)
        .then(res =>{
            console.log(res.data);
            dispatch({
                type: URL_CREATE,
                payload: res.data
            })
        })
        .catch(error =>{
            console.log(error.response);

            dispatch({
                type: URL_CREATE
            })

            return error;
        });

}

export const editUrl = (url) => dispatch => {
    dispatch(setUrlLoading());
    return axios
        .put(serverUrl + '/edit', url)
        .then(res =>{
            console.log(res.data);
            dispatch({
                type: URL_EDIT,
                payload: res.data
            })
        })
        .catch(error =>{
            console.log(error.response);

            dispatch({
                type: URL_EDIT
            })

            return error;
        });

}


export const deleteUrl = (code) => dispatch => {
    // dispatch(setUrlLoading());
    return axios
        .delete(serverUrl + `/${code}`)
        .then(res =>{
            dispatch({
                type: URL_DELETE,
                payload: code
            })
        })
        .catch(error =>{
            console.log(error.response);

            dispatch({
                type: URL_DELETE
            })

            return error;
        });

}


export const setUrlLoading = () => {
    return {
        type: URL_LOADING
    };
}
