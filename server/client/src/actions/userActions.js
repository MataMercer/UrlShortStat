import axios from 'axios';
import {USER_LOGIN, USER_REGISTER, USER_LOGOUT, USER_CHECK_SESSION, USER_LOADING} from './types';
import config from './../config/config';

axios.defaults.withCredentials = true; 
const serverUrl = config.serverUrl + '/api/user';
export const registerUser = (user) => dispatch => {
    // dispatch(setUserLoading());
    return axios
        .post(serverUrl + '/register', user)
        .then(res =>{
            
            dispatch({
                type: USER_REGISTER,
                payload: res.data
            })
        })
        .catch(error =>{
            
            console.log(error.response);
           
            dispatch({
                type: USER_REGISTER
            })
            return error;
        });
};

export const loginUser = (user) => dispatch => {
    // dispatch(setUserLoading());

    return axios
        .post(serverUrl + '/login', user)
        .then(res =>{
            console.log(res.data);
            dispatch({
                type: USER_LOGIN,
                payload: res.data 
            })
        })
        .catch(error =>{
            console.log(error.response);
           
            dispatch({
                type: USER_LOGIN
            })

            return error;
            
        });
}

export const logoutUser = (redir) => dispatch => {
    dispatch(setUserLoading());

    axios
        .post(serverUrl + '/logout')
        .then(res =>{
            dispatch({
                type: USER_LOGOUT,
                payload: ''
            })
            redir();
        })
        .catch(error =>{
            console.log(error);
            console.log(error.response);
           
            dispatch({
                type: USER_LOGOUT
            })
            
        });
}

export const checkUserSession = () => dispatch =>{
    dispatch(setUserLoading());
    
    axios
        .get(serverUrl + '/usernameandemail')
        .then(res =>{
            console.log(res.data);
            dispatch({
                type: USER_CHECK_SESSION,
                payload: res.data
            })
        })
        .catch(error =>{
            console.log(error);
            console.log(error.response);
           
            dispatch({
                type: USER_CHECK_SESSION
            })
            
        });
}


export const setUserLoading = () => {
    return {
        type: USER_LOADING
    };
}




