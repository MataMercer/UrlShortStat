import { USER_REGISTER, USER_LOADING, USER_LOGIN, USER_LOGOUT, USER_CHECK_SESSION } from "../actions/types";

const initialState = {
    name: '',
    loading: false
}

export default function(state = initialState, action){
    switch(action.type){
        case USER_REGISTER:
            return {
                ...state,
                name: action.payload ? action.payload.name : '',
                loading: false
            };
        case USER_LOGIN:
            return {
                ...state,
                name: action.payload ? action.payload.name : '',
                loading: false
            }
        case USER_LOGOUT:
            return {
                ...state,
                name: action.payload === '' ? '' : state.name,
                loading: false
            }
        case USER_CHECK_SESSION:
      
            return {
                ...state,
                name: action.payload ? action.payload.name : '',
                loading: false
            }      
        case USER_LOADING:
            return {
                ...state,
                loading: true
            }
        default:
            return state;

    }

}