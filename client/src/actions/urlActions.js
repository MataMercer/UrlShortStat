import axios from 'axios';
import {URL_CREATE, URL_DELETE, URL_GET, URL_UPDATE, URL_LOADING} from './types';

axios.defaults.withCredentials = true; 

export const getUrls = () => dispatch => {
    dispatch(setUrlLoading());
    axios
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
        });

}

export const deleteUrl = (urlCode) => dispatch => {
    // dispatch(setUrlLoading());
    axios
        .delete(`http://localhost:5000/api/url/${urlCode}`)
        .then(res =>{
            dispatch({
                type: URL_DELETE,
                payload: urlCode
            })
        })
        .catch(error =>{
            console.log(error.response);

            dispatch({
                type: URL_DELETE
            })
        });

}


export const setUrlLoading = () => {
    return {
        type: URL_LOADING
    };
}
