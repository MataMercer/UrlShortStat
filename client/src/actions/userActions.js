import axios from 'axios';
import {USER_LOGIN, USER_REGISTER, USER_LOGOUT, USER_CHECK_SESSION, USER_LOADING} from './types';

axios.defaults.withCredentials = true; 

export const registerUser = (user) => dispatch => {
    // dispatch(setUserLoading());
    return axios
        .post('http://localhost:5000/api/user/register', user)
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
        .post('http://localhost:5000/api/user/login', user)
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
        .post('http://localhost:5000/api/user/logout')
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
        .get('http://localhost:5000/api/user/usernameandemail')
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




