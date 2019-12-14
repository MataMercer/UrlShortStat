import axios from 'axios';
import {URL_CREATE, URL_DELETE, URL_GET, URL_UPDATE, URL_LOADING} from './types';

axios.defaults.withCredentials = true; 

export const getUrls = () => dispatch => {
    dispatch(setUrlLoading());
    return axios
        .get('http://localhost:5000/api/url')
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
        .post('http://localhost:5000/api/url/create', url)
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



export const deleteUrl = (code) => dispatch => {
    // dispatch(setUrlLoading());
    return axios
        .delete(`http://localhost:5000/api/url/${code}`)
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
